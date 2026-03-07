import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface InventoryItem {
  id?: number;
  name: string;
  quantity: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface InventoryWidgetProps {
  items: InventoryItem[];
  onOrder: () => void;
  onManageInventory: () => void;
}

const statusColors = {
  'In Stock': 'bg-chart-1 text-primary-foreground',
  'Low Stock': 'bg-chart-4 text-primary-foreground',
  'Out of Stock': 'bg-chart-5 text-primary-foreground'
};

export default function InventoryWidget({ items, onOrder, onManageInventory }: InventoryWidgetProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/inventory/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
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

  const handleDelete = (id: number | undefined, name: string) => {
    if (!id) return;
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteInventoryMutation.mutate(id);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <p className="text-sm text-muted-foreground">Farm supplies and stock status</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/70 p-3 sm:flex-nowrap">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm" data-testid={`text-inventory-name-${index}`}>{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.quantity}</p>
              </div>
              <Badge className={statusColors[item.status]} data-testid={`badge-inventory-status-${index}`}>
                {item.status}
              </Badge>
              {item.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(item.id, item.name)}
                  data-testid={`button-delete-inventory-${index}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-4 sm:flex-row">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={onOrder}
            data-testid="button-order"
          >
            Order
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1"
            onClick={onManageInventory}
            data-testid="button-inventory"
          >
            Inventory
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
