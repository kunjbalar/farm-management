import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SoilMetric {
  name: string;
  value: number;
  label: string;
}

interface SoilHealthWidgetProps {
  metrics: SoilMetric[];
  lastUpdate: string;
}

export default function SoilHealthWidget({ metrics, lastUpdate }: SoilHealthWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Soil Health</CardTitle>
        <p className="text-sm text-muted-foreground">Readiness and monitoring</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium" data-testid={`text-${metric.name.toLowerCase()}`}>{metric.name}</span>
                <span className="text-sm font-medium" data-testid={`text-${metric.name.toLowerCase()}-value`}>{metric.label}</span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">{lastUpdate}</p>
        </div>
      </CardContent>
    </Card>
  );
}
