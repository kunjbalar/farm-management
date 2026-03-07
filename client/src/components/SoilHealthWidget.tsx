import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Save, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { SoilHealth, InsertSoilHealth } from "@shared/schema";

export default function SoilHealthWidget() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    moisture: "",
    phLevel: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    notes: "",
  });

  const queryClient = useQueryClient();

  const { data: soilHealth, isLoading } = useQuery<SoilHealth | null>({
    queryKey: ["/api/soil-health"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (soilHealth) {
      setFormData({
        moisture: soilHealth.moisture || "",
        phLevel: soilHealth.phLevel || "",
        nitrogen: soilHealth.nitrogen || "",
        phosphorus: soilHealth.phosphorus || "",
        potassium: soilHealth.potassium || "",
        notes: soilHealth.notes || "",
      });
    }
  }, [soilHealth]);

  const saveMutation = useMutation({
    mutationFn: async (data: InsertSoilHealth) => {
      const response = await apiRequest("POST", "/api/soil-health", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/soil-health"] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (soilHealth) {
      setFormData({
        moisture: soilHealth.moisture || "",
        phLevel: soilHealth.phLevel || "",
        nitrogen: soilHealth.nitrogen || "",
        phosphorus: soilHealth.phosphorus || "",
        potassium: soilHealth.potassium || "",
        notes: soilHealth.notes || "",
      });
    }
    setIsEditing(false);
  };

  const getProgressValue = (value: string): number => {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? 0 : Math.min(Math.max(numValue, 0), 100);
  };

  const getPhProgressValue = (phValue: string): number => {
    // Treat pH Level as percentage input (0-100%) like other metrics
    const numValue = parseFloat(phValue);
    return isNaN(numValue) ? 0 : Math.min(Math.max(numValue, 0), 100);
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Soil Health</CardTitle>
          <p className="text-sm text-muted-foreground">Readiness and monitoring</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Soil Health</CardTitle>
            <p className="text-sm text-muted-foreground">Readiness and monitoring</p>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              data-testid="button-edit-soil"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                data-testid="button-cancel-soil"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                data-testid="button-save-soil"
              >
                <Save className="h-4 w-4 mr-1" />
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
          {/* Moisture */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <Label htmlFor="moisture" className="text-sm font-medium">
                Moisture
              </Label>
              {isEditing ? (
                <Input
                  id="moisture"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.moisture}
                  onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                  className="h-8 w-24 text-sm"
                  placeholder="%"
                  data-testid="input-moisture"
                />
              ) : (
                <span className="text-sm font-medium" data-testid="text-moisture-value">
                  {formData.moisture ? `${formData.moisture}%` : "N/A"}
                </span>
              )}
            </div>
            <Progress value={getProgressValue(formData.moisture)} className="h-2" />
          </div>

          {/* pH Level */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <Label htmlFor="phLevel" className="text-sm font-medium">
                pH Level
              </Label>
              {isEditing ? (
                <Input
                  id="phLevel"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.phLevel}
                  onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
                  className="w-20 h-7 text-sm"
                  placeholder="%"
                  data-testid="input-phlevel"
                />
              ) : (
                <span className="text-sm font-medium" data-testid="text-phlevel-value">
                  {formData.phLevel ? `${formData.phLevel}%` : "N/A"}
                </span>
              )}
            </div>
            <Progress value={getPhProgressValue(formData.phLevel)} className="h-2" />
          </div>

          {/* Nitrogen */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <Label htmlFor="nitrogen" className="text-sm font-medium">
                Nitrogen
              </Label>
              {isEditing ? (
                <Input
                  id="nitrogen"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  className="w-20 h-7 text-sm"
                  placeholder="%"
                  data-testid="input-nitrogen"
                />
              ) : (
                <span className="text-sm font-medium" data-testid="text-nitrogen-value">
                  {formData.nitrogen ? `${formData.nitrogen}%` : "N/A"}
                </span>
              )}
            </div>
            <Progress value={getProgressValue(formData.nitrogen)} className="h-2" />
          </div>

          {/* Phosphorus */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <Label htmlFor="phosphorus" className="text-sm font-medium">
                Phosphorus
              </Label>
              {isEditing ? (
                <Input
                  id="phosphorus"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                  className="w-20 h-7 text-sm"
                  placeholder="%"
                  data-testid="input-phosphorus"
                />
              ) : (
                <span className="text-sm font-medium" data-testid="text-phosphorus-value">
                  {formData.phosphorus ? `${formData.phosphorus}%` : "N/A"}
                </span>
              )}
            </div>
            <Progress value={getProgressValue(formData.phosphorus)} className="h-2" />
          </div>

          {/* Potassium */}
          <div>
            <div className="flex justify-between mb-2 items-center">
              <Label htmlFor="potassium" className="text-sm font-medium">
                Potassium
              </Label>
              {isEditing ? (
                <Input
                  id="potassium"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  className="w-20 h-7 text-sm"
                  placeholder="%"
                  data-testid="input-potassium"
                />
              ) : (
                <span className="text-sm font-medium" data-testid="text-potassium-value">
                  {formData.potassium ? `${formData.potassium}%` : "N/A"}
                </span>
              )}
            </div>
            <Progress value={getProgressValue(formData.potassium)} className="h-2" />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {soilHealth
              ? `Last updated: ${new Date(soilHealth.updatedAt).toLocaleString()}`
              : "No data yet - click Edit to add soil health metrics"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
