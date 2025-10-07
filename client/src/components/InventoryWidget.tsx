import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InventoryItem {
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Inventory</CardTitle>
        <p className="text-sm text-muted-foreground">Farm supplies and stock status</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm" data-testid={`text-inventory-name-${index}`}>{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.quantity}</p>
              </div>
              <Badge className={statusColors[item.status]} data-testid={`badge-inventory-status-${index}`}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
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
