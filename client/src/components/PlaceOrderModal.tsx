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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PlaceOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderFormData {
  name: string;
  quantity: string;
  status: string;
}

export default function PlaceOrderModal({ open, onOpenChange }: PlaceOrderModalProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    quantity: "",
    status: "In Stock",
  });
  const { toast } = useToast();

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      const orderDetails = `${data.name} - ${data.quantity}`;
      return await apiRequest("POST", "/api/orders", {
        orderDetails,
        name: data.name,
        quantity: data.quantity,
        status: data.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Order placed successfully!",
        description: "Your supply order has been submitted and added to inventory.",
      });
      setFormData({ name: "", quantity: "", status: "In Stock" });
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
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter item name.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.quantity.trim()) {
      toast({
        title: "Error",
        description: "Please enter quantity.",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]" data-testid="dialog-place-order">
        <DialogHeader>
          <DialogTitle>Place a New Supply Order</DialogTitle>
          <DialogDescription>
            Enter the details of the farm supplies you need to order.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              placeholder="e.g., Urea Fertilizer"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-item-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              placeholder="e.g., 500 kg"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              data-testid="input-quantity"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status" data-testid="select-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="pt-1">
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
