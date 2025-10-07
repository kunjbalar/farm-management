import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets } from "lucide-react";

interface IrrigationScheduleProps {
  schedules: Array<{
    field: string;
    time: string;
    duration: string;
    waterUsage: string;
  }>;
  onScheduleNew: () => void;
}

export default function IrrigationScheduleCard({ schedules, onScheduleNew }: IrrigationScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Irrigation Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {schedules.map((schedule, index) => (
            <div key={index} className="p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm" data-testid={`text-field-${index}`}>{schedule.field}</h4>
                <span className="text-sm text-muted-foreground ml-auto">{schedule.time}</span>
              </div>
              <p className="text-xs text-muted-foreground">Duration: {schedule.duration}</p>
              <p className="text-xs text-muted-foreground">Water usage ~ {schedule.waterUsage}</p>
            </div>
          ))}
        </div>

        <Button 
          className="w-full"
          onClick={onScheduleNew}
          data-testid="button-schedule-irrigation"
        >
          Schedule New Irrigation
        </Button>
      </CardContent>
    </Card>
  );
}
