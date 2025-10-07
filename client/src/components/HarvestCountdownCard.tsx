import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface HarvestCountdownProps {
  harvests: Array<{
    crop: string;
    date: string;
    progress: number;
    stage: string;
  }>;
}

export default function HarvestCountdownCard({ harvests }: HarvestCountdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Harvest Countdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {harvests.map((harvest, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm" data-testid={`text-harvest-crop-${index}`}>{harvest.crop}</h4>
                  <p className="text-xs text-muted-foreground">Current Stage: {harvest.stage}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium" data-testid={`text-harvest-date-${index}`}>{harvest.date}</span>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                    View Schedule
                  </Button>
                </div>
              </div>
              <Progress value={harvest.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
