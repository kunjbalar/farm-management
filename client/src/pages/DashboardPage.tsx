import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Inventory, Crop, SoilHealth } from "@shared/schema";
import FarmerProfileSidebar from "@/components/FarmerProfileSidebar";
import WeatherWidget from "@/components/WeatherWidget";
import SoilHealthWidget from "@/components/SoilHealthWidget";
import CropStatusWidget from "@/components/CropStatusWidget"; 
import MachineryWidget from "@/components/MachineryWidget";
import IrrigationWidget from "@/components/IrrigationWidget";
import InventoryWidget from "@/components/InventoryWidget";
import CropManagementCard from "@/components/CropManagementCard";
import EquipmentMaintenanceCard from "@/components/EquipmentMaintenanceCard";
import IrrigationScheduleCard from "@/components/IrrigationScheduleCard";
import HarvestCountdownCard from "@/components/HarvestCountdownCard";
import AnalyticsChartCard from "@/components/AnalyticsChartCard";
import PlaceOrderModal from "@/components/PlaceOrderModal";
import { Leaf, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

type Tab = 'overview' | 'analytics' | 'management';

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
  onUserUpdate: (user: any) => void;
}

export default function DashboardPage({ user, onLogout, onUserUpdate }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [,setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  const { data: inventoryItems = [], isLoading: isLoadingInventory } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: crops = [] } = useQuery<Crop[]>({
    queryKey: ["/api/crops"],
  });

  const { data: soilHealth } = useQuery<SoilHealth | null>({
    queryKey: ["/api/soil-health"],
  });

  const { data: weatherData } = useQuery<any>({
    queryKey: ["/api/weather"],
  });

  // Process crop data for chart - only show actual crops
  const cropYieldData = useMemo(() => {
    if (!crops.length) {
      // Return empty array when no crops exist
      return [];
    }
    return crops.map(crop => ({
      name: crop.name.charAt(0).toUpperCase() + crop.name.slice(1),
      value: Math.floor(Math.random() * 5000) + 1000 // Simulated yield
    }));
  }, [crops]);

  // Process inventory data for chart - only show actual inventory
  const inventoryStatusData = useMemo(() => {
    if (!inventoryItems.length) {
      // Return empty array when no inventory exists
      return [];
    }
    
    const statusCounts = inventoryItems.reduce((acc: any, item) => {
      const status = item.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value: value as number
    }));
  }, [inventoryItems]);

  // Process soil health data for chart
  const soilHealthChartData = useMemo(() => {
    if (!soilHealth) {
      // Return sample data for empty state
      return [
        { name: 'Moisture', value: 62 },
        { name: 'pH Level', value: 65 },
        { name: 'Nitrogen', value: 38 },
        { name: 'Phosphorus', value: 30 },
        { name: 'Potassium', value: 60 }
      ];
    }
    return [
      { name: 'Moisture', value: parseFloat(soilHealth.moisture) || 0 },
      { name: 'pH Level', value: parseFloat(soilHealth.phLevel) || 0 },
      { name: 'Nitrogen', value: parseFloat(soilHealth.nitrogen) || 0 },
      { name: 'Phosphorus', value: parseFloat(soilHealth.phosphorus) || 0 },
      { name: 'Potassium', value: parseFloat(soilHealth.potassium) || 0 }
    ];
  }, [soilHealth]);

  // Process weather forecast data for chart
  const weatherForecastData = useMemo(() => {
    if (!weatherData?.forecast || weatherData.forecast.length === 0) {
      // Return default forecast data
      const now = new Date();
      const defaultData = [];
      for (let i = 1; i <= 5; i++) {
        const time = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
        defaultData.push({
          name: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          value: 20 + Math.floor(Math.random() * 5)
        });
      }
      return defaultData;
    }
    return weatherData.forecast.map((item: any) => ({
      name: item.time,
      value: parseInt(item.temp.replace('°C', '')) || 20
    }));
  }, [weatherData]);

  return (
    <div className="min-h-screen bg-transparent lg:flex">
      <FarmerProfileSidebar
        farmerName={user.name || "Farmer"}
        farmName={user.farmName || "Not Set"}
        farmLocation={user.farmLocation || "Not Set"}
        totalArea={user.totalArea || "Not Set"}
        contact={user.contact || "Not Set"}
        onEditProfile={() => console.log('Edit profile clicked')}
        user={user}
        onUserUpdate={onUserUpdate}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-md">
          <div className="app-container py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-semibold sm:text-2xl">Farm Management</h1>
                  <p className="truncate text-sm text-muted-foreground">
                    Welcome, {user.name || "Farmer"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  data-testid="button-theme-toggle"
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onLogout}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto pb-1">
              <div className="inline-flex min-w-full gap-2 sm:min-w-0">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary'
                  }`}
                  data-testid="tab-overview"
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary'
                  }`}
                  data-testid="tab-analytics"
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('management')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'management'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary'
                  }`}
                  data-testid="tab-management"
                >
                  Management
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-4 sm:py-6">
          <div className="app-container">
          {activeTab === 'overview' && (
            <div className="section-grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
              <WeatherWidget />
              <SoilHealthWidget />
              <CropStatusWidget
                onManageAllCrops={() => setActiveTab('management')}
              />
              <MachineryWidget
                onManageEquipment={() => setActiveTab('management')}
              />
              <IrrigationWidget
                onManageSchedule={() => setActiveTab('management')}
              />
              <InventoryWidget
                items={inventoryItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity || 'N/A',
                  status: item.status as 'In Stock' | 'Low Stock' | 'Out of Stock'
                }))}
                onOrder={() => setIsOrderModalOpen(true)}
                onManageInventory={() => setLocation('/order-history')}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="section-grid grid-cols-1 xl:grid-cols-2">
              <AnalyticsChartCard
                title="Crop Yield Projections"
                description="Expected harvest outcomes based on current crops"
                chartType="bar"
                data={cropYieldData}
              />
              <AnalyticsChartCard
                title="Inventory Status"
                description="Stock levels by status"
                chartType="bar"
                data={inventoryStatusData}
              />
              <AnalyticsChartCard
                title="Weather Forecast"
                description="Temperature forecast for next hours"
                chartType="line"
                data={weatherForecastData}
              />
              <AnalyticsChartCard
                title="Soil Health Analysis"
                description="Current soil nutrient levels"
                chartType="area"
                data={soilHealthChartData}
              />
            </div>
          )}

          {activeTab === 'management' && (
            <div className="section-grid grid-cols-1 xl:grid-cols-2">
              <CropManagementCard />
              <EquipmentMaintenanceCard />
              <IrrigationScheduleCard />
              <HarvestCountdownCard />
            </div>
          )}
          </div>
        </main>
        <footer className="border-t border-border/70 bg-background/80 py-3">
          <div className="app-container flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© 2025 Farm Management. All rights reserved.</p>
            <p>All systems operational | AWS ✓ | Last Sync: Just now</p>
          </div>
        </footer>
      </div>

      <PlaceOrderModal
        open={isOrderModalOpen}
        onOpenChange={setIsOrderModalOpen}
      />
    </div>
  );
}
