import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

interface Alert {
  type: 'warning' | 'info' | 'critical';
  message: string;
}

interface AlertsWidgetProps {
  alerts: Alert[];
  onViewAllAlerts: () => void;
}

export default function AlertsWidget({ alerts, onViewAllAlerts }: AlertsWidgetProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-chart-4" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-chart-5" />;
      case 'info':
        return <Info className="w-5 h-5 text-chart-3" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-chart-4/10';
      case 'critical':
        return 'bg-chart-5/10';
      case 'info':
        return 'bg-chart-3/10';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alerts</CardTitle>
        <p className="text-sm text-muted-foreground">Critical notifications and warnings</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 p-3 rounded-lg ${getAlertBg(alert.type)}`}
              data-testid={`alert-${index}`}
            >
              {getAlertIcon(alert.type)}
              <p className="text-sm flex-1">{alert.message}</p>
            </div>
          ))}
        </div>

        <Button 
          variant="ghost" 
          className="w-full mt-4 text-primary"
          onClick={onViewAllAlerts}
          data-testid="button-view-all-alerts"
        >
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  );
}
