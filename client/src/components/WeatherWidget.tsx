import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

interface WeatherWidgetProps {
  temperature: string;
  condition: string;
  humidity: string;
  wind: string;
  forecast: Array<{ time: string; temp: string }>;
}

export default function WeatherWidget({ temperature, condition, humidity, wind, forecast }: WeatherWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weather</CardTitle>
        <p className="text-sm text-muted-foreground">Current conditions at your farm</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-4xl font-bold" data-testid="text-temperature">{temperature}</div>
            <div className="text-sm text-muted-foreground mt-1">{condition}</div>
          </div>
          <div className="w-20 h-20 flex items-center justify-center">
            <Cloud className="w-16 h-16 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Humidity</div>
            <div className="text-base font-medium" data-testid="text-humidity">{humidity}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Wind</div>
            <div className="text-base font-medium" data-testid="text-wind">{wind}</div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="text-sm font-medium mb-2">24-Hour Forecast</div>
          <div className="flex justify-between">
            {forecast.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{item.time}</div>
                <div className="text-sm font-medium">{item.temp}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
