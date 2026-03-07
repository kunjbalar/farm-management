import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wheat, Calendar, Edit2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Crop } from "@shared/schema";

const growthStages = [
  'Seedling',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Maturation',
  'Ready for Harvest'
];

const calculateProgress = (plantingDate: string | null, harvestDate: string | null): number => {
  if (!plantingDate || !harvestDate) return 0;
  
  const planted = new Date(plantingDate).getTime();
  const harvest = new Date(harvestDate).getTime();
  const now = Date.now();
  
  if (now < planted) return 0;
  if (now > harvest) return 100;
  
  const totalDuration = harvest - planted;
  const elapsed = now - planted;
  return Math.round((elapsed / totalDuration) * 100);
};

const getDaysUntilHarvest = (harvestDate: string | null): number => {
  if (!harvestDate) return 0;
  return Math.ceil((new Date(harvestDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

export default function HarvestCountdownCard() {
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    currentStage: '',
    plantingDate: '',
    harvestDate: '',
    notes: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch crops
  const { data: crops = [], isLoading } = useQuery<Crop[]>({
    queryKey: ['/api/crops'],
  });

  // Filter only active crops with harvest dates
  const activeCropsWithHarvest = crops.filter(
    crop => crop.status === 'Active' && crop.harvestDate
  ).sort((a, b) => {
    const dateA = a.harvestDate ? new Date(a.harvestDate).getTime() : 0;
    const dateB = b.harvestDate ? new Date(b.harvestDate).getTime() : 0;
    return dateA - dateB;
  });

  // Update crop mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const payload: any = {
        name: selectedCrop?.name,
        status: selectedCrop?.status,
        healthStatus: selectedCrop?.healthStatus,
      };
      
      if (data.plantingDate) payload.plantingDate = new Date(data.plantingDate).toISOString();
      if (data.harvestDate) payload.harvestDate = new Date(data.harvestDate).toISOString();
      if (data.notes) payload.notes = data.notes;
      
      const response = await apiRequest('PUT', `/api/crops/${id}`, payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crops'] });
      setIsUpdateDialogOpen(false);
      setSelectedCrop(null);
      toast({ title: "Success!", description: "Crop progress updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update crop.", variant: "destructive" });
    }
  });

  const handleUpdateClick = (crop: Crop) => {
    setSelectedCrop(crop);
    setUpdateData({
      currentStage: crop.notes?.includes('Stage:') 
        ? crop.notes.split('Stage:')[1].split('|')[0].trim() 
        : 'Vegetative',
      plantingDate: crop.plantingDate ? new Date(crop.plantingDate).toISOString().split('T')[0] : '',
      harvestDate: crop.harvestDate ? new Date(crop.harvestDate).toISOString().split('T')[0] : '',
      notes: crop.notes || ''
    });
    setIsUpdateDialogOpen(true);
  };

  const handleSubmitUpdate = () => {
    if (!selectedCrop) return;
    
    const updatedNotes = `Stage: ${updateData.currentStage} | Updated: ${new Date().toLocaleDateString()}`;
    
    updateMutation.mutate({
      id: selectedCrop.id,
      data: {
        ...updateData,
        notes: updatedNotes
      }
    });
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Harvest Countdown</CardTitle>
          <p className="text-sm text-muted-foreground">Track your crops until harvest</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6 text-muted-foreground">Loading crops...</div>
          ) : activeCropsWithHarvest.length === 0 ? (
            <div className="text-center py-8">
              <Wheat className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No crops with harvest dates</p>
              <p className="text-xs text-muted-foreground mt-1">Add harvest dates in Crop Management</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeCropsWithHarvest.map((crop, index) => {
                const progress = calculateProgress(
                  crop.plantingDate ? crop.plantingDate.toString() : null,
                  crop.harvestDate ? crop.harvestDate.toString() : null
                );
                const daysUntil = getDaysUntilHarvest(crop.harvestDate ? crop.harvestDate.toString() : null);
                const currentStage = crop.notes?.includes('Stage:') 
                  ? crop.notes.split('Stage:')[1].split('|')[0].trim() 
                  : 'Growing';
                const lastUpdate = crop.notes?.includes('Updated:') 
                  ? crop.notes.split('Updated:')[1].trim() 
                  : '';
                
                return (
                  <div key={crop.id} className="rounded-xl border border-border/60 bg-background/70 p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm" data-testid={`text-harvest-crop-${index}`}>
                            {crop.name}
                            {crop.variety && <span className="text-muted-foreground font-normal"> ({crop.variety})</span>}
                          </h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => handleUpdateClick(crop)}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          Current Stage: <span className="font-medium text-foreground">{currentStage}</span>
                        </p>
                        {lastUpdate && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Last updated: {lastUpdate}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium" data-testid={`text-harvest-date-${index}`}>
                          <Calendar className="w-3 h-3" />
                          {crop.harvestDate && new Date(crop.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {daysUntil > 0 ? `${daysUntil} days` : daysUntil === 0 ? 'Today!' : 'Overdue'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progress}% complete</span>
                        <span>{crop.area || 'Area not set'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Update Crop Progress</DialogTitle>
          </DialogHeader>
          {selectedCrop && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">{selectedCrop.name}</Label>
                {selectedCrop.variety && (
                  <p className="text-sm text-muted-foreground">Variety: {selectedCrop.variety}</p>
                )}
              </div>

              <div>
                <Label htmlFor="currentStage">Current Growth Stage</Label>
                <Select 
                  value={updateData.currentStage} 
                  onValueChange={(value) => setUpdateData({ ...updateData, currentStage: value })}
                >
                  <SelectTrigger id="currentStage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {growthStages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plantingDate">Planting Date</Label>
                  <Input
                    id="plantingDate"
                    type="date"
                    value={updateData.plantingDate}
                    onChange={(e) => setUpdateData({ ...updateData, plantingDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={updateData.harvestDate}
                    onChange={(e) => setUpdateData({ ...updateData, harvestDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                <p><strong>Progress:</strong> {calculateProgress(updateData.plantingDate, updateData.harvestDate)}%</p>
                <p><strong>Days until harvest:</strong> {getDaysUntilHarvest(updateData.harvestDate)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitUpdate} disabled={updateMutation.isPending}>
              Update Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
