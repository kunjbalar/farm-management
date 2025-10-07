import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Equipment {
  name: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
  fuelLevel: number;
  lastMaintenance: string;
}

interface MachineryWidgetProps {
  equipment: Equipment[];
}

const statusColors = {
  'Active': 'bg-chart-1 text-primary-foreground',
  'Maintenance': 'bg-chart-4 text-primary-foreground',
  'Inactive': 'bg-secondary text-secondary-foreground'
};

export default function MachineryWidget({ equipment }: MachineryWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Machinery</CardTitle>
        <p className="text-sm text-muted-foreground">Equipment status and tracking</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {equipment.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm" data-testid={`text-equipment-name-${index}`}>{item.name}</h4>
                  <Badge className={statusColors[item.status]} data-testid={`badge-equipment-status-${index}`}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Maint: {item.lastMaintenance}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium" data-testid={`text-fuel-level-${index}`}>{item.fuelLevel}% Fuel</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="default" size="sm" className="flex-1" data-testid="button-track">
            Track
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" data-testid="button-maintenance">
            Maintenance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
