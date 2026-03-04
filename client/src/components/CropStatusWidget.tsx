import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wheat } from "lucide-react";
import type { Crop } from "@shared/schema";

interface CropStatusWidgetProps {
  onManageAllCrops: () => void;
}

const healthColors = {
  'Excellent': 'bg-green-500 text-white',
  'Good': 'bg-blue-500 text-white',
  'Fair': 'bg-yellow-500 text-white',
  'Poor': 'bg-red-500 text-white'
};

const statusBadgeColors = {
  'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Harvested': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  'Inactive': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

const getGrowthStage = (plantingDate: string | null, harvestDate: string | null): string => {
  if (!plantingDate) return 'Not planted';
  
  const planted = new Date(plantingDate).getTime();
  const now = Date.now();
  const harvest = harvestDate ? new Date(harvestDate).getTime() : now + (90 * 24 * 60 * 60 * 1000);
  
  const totalDuration = harvest - planted;
  const elapsed = now - planted;
  const progress = (elapsed / totalDuration) * 100;
  
  if (progress < 0) return 'Not yet planted';
  if (progress < 25) return 'Seedling Stage';
  if (progress < 50) return 'Growth Stage';
  if (progress < 75) return 'Flowering Stage';
  if (progress < 100) return 'Maturation Stage';
  return 'Ready for Harvest';
};

export default function CropStatusWidget({ onManageAllCrops }: CropStatusWidgetProps) {
  const { data: crops = [], isLoading } = useQuery<Crop[]>({
    queryKey: ['/api/crops'],
  });

  // Filter only active crops
  const activeCrops = crops.filter(crop => crop.status === 'Active');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Crop Status</CardTitle>
        <p className="text-sm text-muted-foreground">Current crops and growth stages</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">Loading crops...</div>
        ) : activeCrops.length === 0 ? (
          <div className="text-center py-8">
            <Wheat className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No active crops found</p>
            <Button 
              variant="default" 
              size="sm"
              onClick={onManageAllCrops}
            >
              Add Your First Crop
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activeCrops.slice(0, 4).map((crop, index) => {
                const stage = getGrowthStage(
                  crop.plantingDate ? crop.plantingDate.toString() : null,
                  crop.harvestDate ? crop.harvestDate.toString() : null
                );
                
                return (
                  <div key={crop.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold" data-testid={`text-crop-name-${index}`}>
                          {crop.name}
                          {crop.variety && <span className="text-muted-foreground font-normal text-sm"> ({crop.variety})</span>}
                        </h4>
                        <Badge className={healthColors[crop.healthStatus as keyof typeof healthColors] || healthColors.Good} data-testid={`badge-crop-health-${index}`}>
                          {crop.healthStatus || 'Good'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {crop.area || 'Area not specified'} | {stage}
                      </p>
                      {crop.harvestDate && (
                        <p className="text-xs text-muted-foreground">
                          Harvest: {new Date(crop.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary" 
                      onClick={onManageAllCrops}
                      data-testid={`button-view-details-${index}`}
                    >
                      View Details
                    </Button>
                  </div>
                );
              })}
            </div>

            {activeCrops.length > 4 && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                +{activeCrops.length - 4} more crops
              </p>
            )}

            <Button 
              variant="secondary" 
              className="w-full mt-4"
              onClick={onManageAllCrops}
              data-testid="button-manage-all-crops"
            >
              Manage All Crops
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
