import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PlaceOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PlaceOrderModal({ open, onOpenChange }: PlaceOrderModalProps) {
  const [orderDetails, setOrderDetails] = useState("");
  const { toast } = useToast();

  const createOrderMutation = useMutation({
    mutationFn: async (orderDetails: string) => {
      return await apiRequest("POST", "/api/orders", { orderDetails });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order placed successfully!",
        description: "Your supply order has been submitted.",
      });
      setOrderDetails("");
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!orderDetails.trim()) {
      toast({
        title: "Error",
        description: "Please enter order details.",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate(orderDetails);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-place-order">
        <DialogHeader>
          <DialogTitle>Place a New Supply Order</DialogTitle>
          <DialogDescription>
            Enter the details of the farm supplies you need to order.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="order-details">Order Details</Label>
            <Textarea
              id="order-details"
              placeholder="e.g., 50 bags of Urea Fertilizer, 100kg of Wheat Seeds"
              value={orderDetails}
              onChange={(e) => setOrderDetails(e.target.value)}
              rows={5}
              data-testid="textarea-order-details"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-order"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createOrderMutation.isPending}
            data-testid="button-submit-order"
          >
            {createOrderMutation.isPending ? "Submitting..." : "Submit Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
