import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tractor } from "lucide-react";

interface EquipmentMaintenanceProps {
  equipment: Array<{
    name: string;
    status: string;
    maintenance: string;
  }>;
}

const statusColors: Record<string, string> = {
  'Maint: 7 days ✓': 'bg-chart-4 text-primary-foreground',
  'Maint: 2 days ✓': 'bg-chart-4 text-primary-foreground',
  'Maint: 15 days ✓': 'bg-chart-4 text-primary-foreground',
  'Maint: Overdue ✓': 'bg-chart-5 text-primary-foreground'
};

export default function EquipmentMaintenanceCard({ equipment }: EquipmentMaintenanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Equipment Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {equipment.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Tractor className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm" data-testid={`text-equipment-${index}`}>[Icon] {item.name}</span>
              </div>
              <Badge className={statusColors[item.maintenance] || 'bg-secondary'} data-testid={`badge-maintenance-${index}`}>
                {item.maintenance}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
