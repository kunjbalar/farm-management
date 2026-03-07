import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import type { Order } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function OrderHistoryPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/orders/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number, orderId: string) => {
    if (confirm(`Are you sure you want to delete order "${orderId}"?`)) {
      deleteOrderMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className="app-container space-y-6">
        <div className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation("/")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">Order History</h1>
              <p className="text-sm text-muted-foreground sm:text-base">View all your supply orders</p>
            </div>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="secondary"
            size="sm"
            data-testid="button-back-dashboard"
          >
            Back to Dashboard
          </Button>
        </div>

        {isLoading ? (
          <div className="surface-card flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="grid gap-4 sm:gap-5">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden" data-testid={`card-order-${order.id}`}>
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-order-id-${order.id}`}>
                          {order.orderId}
                        </CardTitle>
                        <CardDescription data-testid={`text-order-date-${order.id}`}>
                          {format(new Date(order.orderDate), "PPP 'at' p")}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(order.id, order.orderId)}
                      data-testid={`button-delete-order-${order.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Order Details</h4>
                    <p className="text-sm text-muted-foreground" data-testid={`text-order-details-${order.id}`}>
                      {order.orderDetails}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't placed any supply orders yet.
              </p>
              <Button onClick={() => setLocation("/")} data-testid="button-go-to-dashboard">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
