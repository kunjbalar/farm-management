import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Crop {
  name: string;
  area: string;
  stage: string;
  health: 'Healthy' | 'Good' | 'Fair' | 'Poor';
  harvestDate: string;
}

interface CropStatusWidgetProps {
  crops: Crop[];
  onManageAllCrops: () => void;
}

const healthColors = {
  'Healthy': 'bg-chart-1 text-primary-foreground',
  'Good': 'bg-chart-3 text-primary-foreground',
  'Fair': 'bg-chart-4 text-primary-foreground',
  'Poor': 'bg-chart-5 text-primary-foreground'
};

export default function CropStatusWidget({ crops, onManageAllCrops }: CropStatusWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Crop Status</CardTitle>
        <p className="text-sm text-muted-foreground">Current crops and growth stages</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {crops.map((crop, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold" data-testid={`text-crop-name-${index}`}>{crop.name}</h4>
                  <Badge className={healthColors[crop.health]} data-testid={`badge-crop-health-${index}`}>
                    {crop.health}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{crop.area} | {crop.stage}</p>
                <p className="text-xs text-muted-foreground">Harvest: {crop.harvestDate}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary" data-testid={`button-view-details-${index}`}>
                View Details
              </Button>
            </div>
          ))}
        </div>

        <Button 
          variant="secondary" 
          className="w-full mt-4"
          onClick={onManageAllCrops}
          data-testid="button-manage-all-crops"
        >
          Manage All Crops
        </Button>
      </CardContent>
    </Card>
  );
}
