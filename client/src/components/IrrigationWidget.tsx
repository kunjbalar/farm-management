import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Irrigation } from "@shared/schema";
import { format, isToday, isTomorrow } from "date-fns";

interface IrrigationWidgetProps {
  onManageSchedule: () => void;
}

export default function IrrigationWidget({ onManageSchedule }: IrrigationWidgetProps) {
  const { data: irrigations = [], isLoading, refetch } = useQuery<Irrigation[]>({
    queryKey: ["/api/irrigation"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always consider data stale
  });

  // Refetch when component mounts or becomes visible
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Debug: Log irrigation data
  useEffect(() => {
    console.log('[IrrigationWidget] Total irrigations:', irrigations.length);
    console.log('[IrrigationWidget] Irrigation data:', irrigations);
  }, [irrigations]);

  // Filter and sort upcoming irrigations
  const upcomingIrrigations = irrigations
    .filter((irr) => {
      // Only filter out completed and cancelled schedules
      // Show all scheduled and in-progress items
      return irr.status !== 'Completed' && irr.status !== 'Cancelled';
    })
    .sort((a, b) => {
      // Sort by scheduled time
      try {
        const dateA = new Date(a.scheduledTime).getTime();
        const dateB = new Date(b.scheduledTime).getTime();
        return dateA - dateB;
      } catch {
        return 0;
      }
    })
    .slice(0, 3); // Show only next 3

  // Debug: Log filtered results
  useEffect(() => {
    console.log('[IrrigationWidget] Upcoming irrigations:', upcomingIrrigations.length);
    console.log('[IrrigationWidget] Filtered data:', upcomingIrrigations);
  }, [upcomingIrrigations]);

  const formatScheduledTime = (dateString: Date | string) => {
    try {
      const date = new Date(dateString);
      
      if (isToday(date)) {
        return `Today, ${format(date, 'h:mm a')}`;
      } else if (isTomorrow(date)) {
        return `Tomorrow, ${format(date, 'h:mm a')}`;
      } else {
        return format(date, 'MMM d, h:mm a');
      }
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-500/10 text-blue-500';
      case 'In Progress':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'Completed':
        return 'bg-green-500/10 text-green-500';
      case 'Cancelled':
        return 'bg-gray-500/10 text-gray-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Irrigation Schedule</CardTitle>
          <div className="rounded-lg bg-primary/10 p-2">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : irrigations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">No irrigation schedules yet</p>
            <Button variant="outline" size="sm" onClick={onManageSchedule}>
              Create Schedule
            </Button>
          </div>
        ) : upcomingIrrigations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              No active schedules
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {irrigations.length} total schedule{irrigations.length !== 1 ? 's' : ''} (completed or cancelled)
            </p>
            <Button variant="outline" size="sm" onClick={onManageSchedule}>
              View All Schedules
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {upcomingIrrigations.map((irrigation) => (
                <div
                  key={irrigation.id}
                  className="rounded-xl border border-border/60 bg-background/70 p-3 transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {irrigation.fieldName}
                        </h4>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(irrigation.status)}`}>
                          {irrigation.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatScheduledTime(irrigation.scheduledTime)}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <p className="text-xs text-muted-foreground">
                          ⏱️ {irrigation.duration}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          💧 {irrigation.waterUsage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={onManageSchedule}
              size="sm"
            >
              Manage All Schedules
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
