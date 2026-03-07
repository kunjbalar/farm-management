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
import { Wheat, Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Crop } from "@shared/schema";

const healthColors = {
  'Excellent': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Good': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Fair': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Poor': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const statusColors = {
  'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Harvested': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  'Inactive': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

interface CropFormData {
  name: string;
  variety: string;
  area: string;
  plantingDate: string;
  harvestDate: string;
  status: string;
  healthStatus: string;
  notes: string;
}

const initialFormData: CropFormData = {
  name: '',
  variety: '',
  area: '',
  plantingDate: '',
  harvestDate: '',
  status: 'Active',
  healthStatus: 'Good',
  notes: ''
};

export default function CropManagementCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [formData, setFormData] = useState<CropFormData>(initialFormData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch crops
  const { data: crops = [], isLoading } = useQuery<Crop[]>({
    queryKey: ['/api/crops'],
  });

  // Create crop mutation
  const createMutation = useMutation({
    mutationFn: async (data: CropFormData) => {
      const payload: any = {
        name: data.name,
        status: data.status || 'Active',
        healthStatus: data.healthStatus || 'Good',
      };
      
      if (data.variety) payload.variety = data.variety;
      if (data.area) payload.area = data.area;
      if (data.notes) payload.notes = data.notes;
      if (data.plantingDate) payload.plantingDate = new Date(data.plantingDate).toISOString();
      if (data.harvestDate) payload.harvestDate = new Date(data.harvestDate).toISOString();
      
      const response = await apiRequest('POST', '/api/crops', payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crops'] });
      setIsDialogOpen(false);
      setFormData(initialFormData);
      toast({ title: "Success!", description: "Crop added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add crop.", variant: "destructive" });
    }
  });

  // Update crop mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CropFormData }) => {
      const payload: any = {
        name: data.name,
        status: data.status || 'Active',
        healthStatus: data.healthStatus || 'Good',
      };
      
      if (data.variety) payload.variety = data.variety;
      if (data.area) payload.area = data.area;
      if (data.notes) payload.notes = data.notes;
      if (data.plantingDate) payload.plantingDate = new Date(data.plantingDate).toISOString();
      if (data.harvestDate) payload.harvestDate = new Date(data.harvestDate).toISOString();
      
      const response = await apiRequest('PUT', `/api/crops/${id}`, payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crops'] });
      setIsDialogOpen(false);
      setEditingCrop(null);
      setFormData(initialFormData);
      toast({ title: "Success!", description: "Crop updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update crop.", variant: "destructive" });
    }
  });

  // Delete crop mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/crops/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crops'] });
      toast({ title: "Success!", description: "Crop deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete crop.", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCrop) {
      updateMutation.mutate({ id: editingCrop.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      variety: crop.variety || '',
      area: crop.area || '',
      plantingDate: crop.plantingDate ? new Date(crop.plantingDate).toISOString().split('T')[0] : '',
      harvestDate: crop.harvestDate ? new Date(crop.harvestDate).toISOString().split('T')[0] : '',
      status: crop.status,
      healthStatus: crop.healthStatus || 'Good',
      notes: crop.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this crop?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCrop(null);
    setFormData(initialFormData);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Crop Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => { setEditingCrop(null); setFormData(initialFormData); }}>
                <Plus className="w-4 h-4 mr-1" />
                Add Crop
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Crop Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Wheat, Rice, Corn"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="variety">Variety</Label>
                    <Input
                      id="variety"
                      value={formData.variety}
                      onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      placeholder="e.g., Golden Harvest"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g., 5 acres, 2 hectares"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Harvested">Harvested</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plantingDate">Planting Date</Label>
                    <Input
                      id="plantingDate"
                      type="date"
                      value={formData.plantingDate}
                      onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="harvestDate">Expected Harvest Date</Label>
                    <Input
                      id="harvestDate"
                      type="date"
                      value={formData.harvestDate}
                      onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="healthStatus">Health Status</Label>
                  <Select value={formData.healthStatus} onValueChange={(value) => setFormData({ ...formData, healthStatus: value })}>
                    <SelectTrigger id="healthStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this crop..."
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingCrop ? 'Update' : 'Add'} Crop
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading crops...</div>
        ) : crops.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wheat className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No crops yet. Click "Add Crop" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {crops.map((crop) => (
              <div key={crop.id} className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/70 p-3 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Wheat className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{crop.name}</span>
                      {crop.variety && <span className="text-sm text-muted-foreground">({crop.variety})</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      {crop.area && <span>📏 {crop.area}</span>}
                      {crop.plantingDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(crop.plantingDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={healthColors[crop.healthStatus as keyof typeof healthColors] || healthColors.Good}>
                    {crop.healthStatus}
                  </Badge>
                  <Badge variant="outline" className={statusColors[crop.status as keyof typeof statusColors] || statusColors.Active}>
                    {crop.status}
                  </Badge>
                  <div className="flex gap-1 ml-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(crop)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(crop.id)} className="text-destructive hover:text-destructive">
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
