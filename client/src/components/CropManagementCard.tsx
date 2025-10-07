import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wheat } from "lucide-react";

interface CropManagementProps {
  crops: Array<{
    name: string;
    health: 'Excellent' | 'Good' | 'Fair';
  }>;
}

const healthColors = {
  'Excellent': 'bg-chart-1 text-primary-foreground',
  'Good': 'bg-chart-3 text-primary-foreground',
  'Fair': 'bg-chart-4 text-primary-foreground'
};

export default function CropManagementCard({ crops }: CropManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Crop Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {crops.map((crop, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Wheat className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium" data-testid={`text-crop-${index}`}>[Icon] {crop.name}</span>
              </div>
              <Badge className={healthColors[crop.health]} data-testid={`badge-crop-health-${index}`}>
                {crop.health} ✓
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
