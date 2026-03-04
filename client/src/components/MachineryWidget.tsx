import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tractor, Fuel, Calendar } from "lucide-react";
import type { Equipment } from "@shared/schema";

interface MachineryWidgetProps {
  onManageEquipment: () => void;
}

const statusColors = {
  'Operational': 'bg-green-500 text-white',
  'Maintenance': 'bg-yellow-500 text-white',
  'Broken': 'bg-red-500 text-white',
  'Idle': 'bg-gray-500 text-white'
};

const getMaintenanceText = (nextMaintenance: Date | string | null): { text: string; urgent: boolean } => {
  if (!nextMaintenance) return { text: 'Not scheduled', urgent: false };
  
  const maintenanceDate = nextMaintenance instanceof Date ? nextMaintenance : new Date(nextMaintenance);
  const daysUntil = Math.ceil((maintenanceDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysUntil < 0) return { text: `Overdue by ${Math.abs(daysUntil)} days`, urgent: true };
  if (daysUntil === 0) return { text: 'Due today', urgent: true };
  if (daysUntil <= 7) return { text: `Due in ${daysUntil} days`, urgent: true };
  return { text: `Due in ${daysUntil} days`, urgent: false };
};

const parseFuelLevel = (fuelLevel: string | null): number => {
  if (!fuelLevel) return 0;
  const match = fuelLevel.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

export default function MachineryWidget({ onManageEquipment }: MachineryWidgetProps) {
  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });

  // Filter operational and maintenance equipment (not broken or idle)
  const activeEquipment = equipment.filter(e => e.status === 'Operational' || e.status === 'Maintenance');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Machinery</CardTitle>
        <p className="text-sm text-muted-foreground">Equipment status and tracking</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">Loading equipment...</div>
        ) : activeEquipment.length === 0 ? (
          <div className="text-center py-8">
            <Tractor className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No equipment found</p>
            <Button 
              variant="default" 
              size="sm"
              onClick={onManageEquipment}
            >
              Add Equipment
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activeEquipment.slice(0, 4).map((item, index) => {
                const maintenance = getMaintenanceText(item.nextMaintenance);
                const fuelPercent = parseFuelLevel(item.fuelLevel);
                
                return (
                  <div key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm" data-testid={`text-equipment-name-${index}`}>
                          {item.name}
                        </h4>
                        <Badge className={statusColors[item.status as keyof typeof statusColors] || statusColors.Operational} data-testid={`badge-equipment-status-${index}`}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className={maintenance.urgent ? 'text-orange-600 font-medium' : ''}>
                            {maintenance.text}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto text-left sm:text-right">
                      <div className="flex items-center gap-1 text-sm font-medium" data-testid={`text-fuel-level-${index}`}>
                        <Fuel className="w-4 h-4" />
                        {item.fuelLevel || 'N/A'}
                      </div>
                      {fuelPercent > 0 && (
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              fuelPercent > 50 ? 'bg-green-500' : 
                              fuelPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(fuelPercent, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {activeEquipment.length > 4 && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                +{activeEquipment.length - 4} more equipment
              </p>
            )}

            <div className="flex gap-2 mt-4">
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1"
                onClick={onManageEquipment}
                data-testid="button-maintenance"
              >
                Manage Equipment
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
