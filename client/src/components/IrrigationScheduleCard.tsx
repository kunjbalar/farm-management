import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Edit, Trash2, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Irrigation } from "@shared/schema";
import { format } from "date-fns";

export default function IrrigationScheduleCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIrrigation, setEditingIrrigation] = useState<Irrigation | null>(null);
  const [formData, setFormData] = useState({
    fieldName: "",
    scheduledTime: "",
    duration: "",
    waterUsage: "",
    status: "Scheduled",
    notes: "",
  });

  const queryClient = useQueryClient();

  const { data: irrigations = [], isLoading } = useQuery<Irrigation[]>({
    queryKey: ["/api/irrigation"],
    refetchOnMount: true,
    staleTime: 0,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const filteredData = {
        fieldName: data.fieldName,
        scheduledTime: data.scheduledTime ? new Date(data.scheduledTime).toISOString() : new Date().toISOString(),
        duration: data.duration,
        waterUsage: data.waterUsage,
        status: data.status,
      } as any;

      if (data.notes) filteredData.notes = data.notes;

      const response = await apiRequest('POST', '/api/irrigation', filteredData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/irrigation"] });
      resetForm();
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const filteredData = {
        fieldName: data.fieldName,
        scheduledTime: data.scheduledTime ? new Date(data.scheduledTime).toISOString() : new Date().toISOString(),
        duration: data.duration,
        waterUsage: data.waterUsage,
        status: data.status,
      } as any;

      if (data.notes) filteredData.notes = data.notes;

      const response = await apiRequest('PUT', `/api/irrigation/${id}`, filteredData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/irrigation"] });
      resetForm();
      setIsDialogOpen(false);
      setEditingIrrigation(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/irrigation/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/irrigation"] });
    },
  });

  const resetForm = () => {
    setFormData({
      fieldName: "",
      scheduledTime: "",
      duration: "",
      waterUsage: "",
      status: "Scheduled",
      notes: "",
    });
    setEditingIrrigation(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIrrigation) {
      updateMutation.mutate({ id: editingIrrigation.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (irrigation: Irrigation) => {
    setEditingIrrigation(irrigation);
    setFormData({
      fieldName: irrigation.fieldName,
      scheduledTime: irrigation.scheduledTime ? format(new Date(irrigation.scheduledTime), "yyyy-MM-dd'T'HH:mm") : "",
      duration: irrigation.duration,
      waterUsage: irrigation.waterUsage,
      status: irrigation.status,
      notes: irrigation.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this irrigation schedule?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatScheduledTime = (dateString: Date | string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === now.toDateString()) {
        return `Today, ${format(date, 'h:mm a')}`;
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow, ${format(date, 'h:mm a')}`;
      } else {
        return format(date, 'MMM d, h:mm a');
      }
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Irrigation Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : irrigations.length === 0 ? (
          <p className="text-sm text-muted-foreground mb-4">No irrigation schedules yet. Create one to get started.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {irrigations.map((irrigation) => (
              <div key={irrigation.id} className="p-3 rounded-lg border border-border">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm" data-testid={`text-field-${irrigation.id}`}>
                    {irrigation.fieldName}
                  </h4>
                  <span className="text-sm text-muted-foreground sm:ml-auto">
                    {formatScheduledTime(irrigation.scheduledTime)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleEdit(irrigation)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={() => handleDelete(irrigation.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Duration: {irrigation.duration}</p>
                <p className="text-xs text-muted-foreground">Water usage: {irrigation.waterUsage}</p>
                <p className="text-xs text-muted-foreground">Status: {irrigation.status}</p>
                {irrigation.notes && (
                  <p className="text-xs text-muted-foreground mt-1">Notes: {irrigation.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              className="w-full"
              data-testid="button-schedule-irrigation"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule New Irrigation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIrrigation ? 'Edit Irrigation Schedule' : 'New Irrigation Schedule'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  value={formData.fieldName}
                  onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                  placeholder="e.g., Corn Field (North)"
                  required
                />
              </div>
              <div>
                <Label htmlFor="scheduledTime">Scheduled Date & Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 40 minutes"
                  required
                />
              </div>
              <div>
                <Label htmlFor="waterUsage">Water Usage</Label>
                <Input
                  id="waterUsage"
                  value={formData.waterUsage}
                  onChange={(e) => setFormData({ ...formData, waterUsage: e.target.value })}
                  placeholder="e.g., 1,200 gallons"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="submit" className="flex-1">
                  {editingIrrigation ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
