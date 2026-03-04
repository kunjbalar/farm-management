import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tractor, Plus, Pencil, Trash2, Calendar, Fuel } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Equipment } from "@shared/schema";

const statusColors = {
  'Operational': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Broken': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Idle': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
};

interface EquipmentFormData {
  name: string;
  type: string;
  status: string;
  fuelLevel: string;
  lastMaintenance: string;
  nextMaintenance: string;
  notes: string;
}

const initialFormData: EquipmentFormData = {
  name: '',
  type: '',
  status: 'Operational',
  fuelLevel: '100%',
  lastMaintenance: '',
  nextMaintenance: '',
  notes: ''
};

export default function EquipmentMaintenanceCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState<EquipmentFormData>(initialFormData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch equipment
  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });

  // Create equipment mutation
  const createMutation = useMutation({
    mutationFn: async (data: EquipmentFormData) => {
      const payload: any = {
        name: data.name,
        type: data.type,
        status: data.status || 'Operational',
      };
      
      if (data.fuelLevel) payload.fuelLevel = data.fuelLevel;
      if (data.notes) payload.notes = data.notes;
      if (data.lastMaintenance) payload.lastMaintenance = new Date(data.lastMaintenance).toISOString();
      if (data.nextMaintenance) payload.nextMaintenance = new Date(data.nextMaintenance).toISOString();
      
      const response = await apiRequest('POST', '/api/equipment', payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      setIsDialogOpen(false);
      setFormData(initialFormData);
      toast({ title: "Success!", description: "Equipment added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add equipment.", variant: "destructive" });
    }
  });

  // Update equipment mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EquipmentFormData }) => {
      const payload: any = {
        name: data.name,
        type: data.type,
        status: data.status || 'Operational',
      };
      
      if (data.fuelLevel) payload.fuelLevel = data.fuelLevel;
      if (data.notes) payload.notes = data.notes;
      if (data.lastMaintenance) payload.lastMaintenance = new Date(data.lastMaintenance).toISOString();
      if (data.nextMaintenance) payload.nextMaintenance = new Date(data.nextMaintenance).toISOString();
      
      const response = await apiRequest('PUT', `/api/equipment/${id}`, payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      setIsDialogOpen(false);
      setEditingEquipment(null);
      setFormData(initialFormData);
      toast({ title: "Success!", description: "Equipment updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update equipment.", variant: "destructive" });
    }
  });

  // Delete equipment mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/equipment/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      toast({ title: "Success!", description: "Equipment deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete equipment.", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEquipment) {
      updateMutation.mutate({ id: editingEquipment.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (equip: Equipment) => {
    setEditingEquipment(equip);
    setFormData({
      name: equip.name,
      type: equip.type,
      status: equip.status,
      fuelLevel: equip.fuelLevel || '100%',
      lastMaintenance: equip.lastMaintenance ? new Date(equip.lastMaintenance).toISOString().split('T')[0] : '',
      nextMaintenance: equip.nextMaintenance ? new Date(equip.nextMaintenance).toISOString().split('T')[0] : '',
      notes: equip.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingEquipment(null);
    setFormData(initialFormData);
  };

  const getMaintenanceStatus = (nextMaintenance: Date | string | null) => {
    if (!nextMaintenance) return null;
    const maintenanceDate = nextMaintenance instanceof Date ? nextMaintenance : new Date(nextMaintenance);
    const daysUntil = Math.ceil((maintenanceDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return <Badge variant="destructive">Overdue by {Math.abs(daysUntil)} days</Badge>;
    if (daysUntil <= 7) return <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Due in {daysUntil} days</Badge>;
    return <Badge variant="outline" className="bg-green-50 text-green-800">Due in {daysUntil} days</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Equipment Maintenance</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => { setEditingEquipment(null); setFormData(initialFormData); }}>
                <Plus className="w-4 h-4 mr-1" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Equipment Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Tractor, Harvester"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Input
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="e.g., Heavy Machinery, Tools"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operational">Operational</SelectItem>
                        <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                        <SelectItem value="Broken">Broken</SelectItem>
                        <SelectItem value="Idle">Idle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fuelLevel">Fuel Level</Label>
                    <Input
                      id="fuelLevel"
                      value={formData.fuelLevel}
                      onChange={(e) => setFormData({ ...formData, fuelLevel: e.target.value })}
                      placeholder="e.g., 75%, Full, Empty"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastMaintenance">Last Maintenance Date</Label>
                    <Input
                      id="lastMaintenance"
                      type="date"
                      value={formData.lastMaintenance}
                      onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextMaintenance">Next Maintenance Date</Label>
                    <Input
                      id="nextMaintenance"
                      type="date"
                      value={formData.nextMaintenance}
                      onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this equipment..."
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingEquipment ? 'Update' : 'Add'} Equipment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading equipment...</div>
        ) : equipment.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Tractor className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No equipment yet. Click "Add Equipment" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {equipment.map((equip) => (
              <div key={equip.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <Tractor className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{equip.name}</span>
                      <span className="text-sm text-muted-foreground">({equip.type})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      {equip.fuelLevel && (
                        <span className="flex items-center gap-1">
                          <Fuel className="w-3 h-3" />
                          {equip.fuelLevel}
                        </span>
                      )}
                      {equip.lastMaintenance && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Last: {new Date(equip.lastMaintenance).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={statusColors[equip.status as keyof typeof statusColors] || statusColors.Operational}>
                    {equip.status}
                  </Badge>
                  {getMaintenanceStatus(equip.nextMaintenance)}
                  <div className="flex gap-1 ml-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(equip)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(equip.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
