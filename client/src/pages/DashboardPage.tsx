import { useState } from "react";
import { Button } from "@/components/ui/button";
import FarmerProfileSidebar from "@/components/FarmerProfileSidebar";
import WeatherWidget from "@/components/WeatherWidget";
import SoilHealthWidget from "@/components/SoilHealthWidget";
import CropStatusWidget from "@/components/CropStatusWidget";
import MachineryWidget from "@/components/MachineryWidget";
import AlertsWidget from "@/components/AlertsWidget";
import InventoryWidget from "@/components/InventoryWidget";
import CropManagementCard from "@/components/CropManagementCard";
import EquipmentMaintenanceCard from "@/components/EquipmentMaintenanceCard";
import IrrigationScheduleCard from "@/components/IrrigationScheduleCard";
import HarvestCountdownCard from "@/components/HarvestCountdownCard";
import AnalyticsChartCard from "@/components/AnalyticsChartCard";
import { Leaf } from "lucide-react";

type Tab = 'overview' | 'analytics' | 'management';

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
  onUserUpdate: (user: any) => void;
}

export default function DashboardPage({ user, onLogout, onUserUpdate }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // TODO: Remove mock data - this is just for the prototype
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 }
  ];

  const cropYieldData = [
    { name: 'Wheat', value: 2400 },
    { name: 'Potatoes', value: 1398 },
    { name: 'Carrots', value: 9800 },
    { name: 'Onions', value: 3908 }
  ];

  return (
    <div className="flex h-screen bg-background">
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-primary border-b border-primary-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 text-primary-foreground" />
            <h1 className="text-xl font-bold text-primary-foreground">Farm Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground">Welcome</span>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onLogout}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </header>

        <div className="bg-background border-b border-border px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              data-testid="tab-overview"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              data-testid="tab-analytics"
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'management'
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              data-testid="tab-management"
            >
              Management
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <WeatherWidget
                temperature="20°C"
                condition="Partly Cloudy"
                humidity="75%"
                wind="25 km/h"
                forecast={[
                  { time: '9PM', temp: '19°' },
                  { time: '10PM', temp: '19°' },
                  { time: '11PM', temp: '18°' },
                  { time: '12AM', temp: '18°' },
                  { time: '1AM', temp: '18°' }
                ]}
              />
              <SoilHealthWidget
                metrics={[
                  { name: 'Moisture', value: 62, label: '62%' },
                  { name: 'pH Level', value: 65, label: '6.5' },
                  { name: 'Nitrogen', value: 38, label: '38%' },
                  { name: 'Phosphorus', value: 30, label: '30%' },
                  { name: 'Potassium', value: 60, label: '60%' }
                ]}
                lastUpdate="LIVE DATA: Soil sensors updating every 5 minutes"
              />
              <CropStatusWidget
                crops={[
                  { name: 'Wheat', area: '200 acres', stage: 'Growth Stage', health: 'Healthy', harvestDate: '15 Jul 2025' },
                  { name: 'Potatoes', area: '100 acres', stage: 'Planting Stage', health: 'Good', harvestDate: '10 Aug 2025' },
                  { name: 'Carrots', area: '50 acres', stage: 'Seedling Stage', health: 'Good', harvestDate: '25 Sep 2025' },
                  { name: 'Onions', area: '150 acres', stage: 'Growth Stage', health: 'Fair', harvestDate: '10 Oct 2025' }
                ]}
                onManageAllCrops={() => setActiveTab('management')}
              />
              <MachineryWidget
                equipment={[
                  { name: 'Massey Ferguson 7726', status: 'Active', fuelLevel: 92, lastMaintenance: 'Maint: 1 Month ago' },
                  { name: 'Kubota M7-172', status: 'Maintenance', fuelLevel: 45, lastMaintenance: 'Maint: 2 days ago' },
                  { name: 'Drip Irrigation System', status: 'Active', fuelLevel: 100, lastMaintenance: 'Maint: 15 days ago' },
                  { name: 'Automated Seeder', status: 'Inactive', fuelLevel: 0, lastMaintenance: 'Maint: 3 Months ago' }
                ]}
              />
              <AlertsWidget
                alerts={[
                  { type: 'warning', message: 'Low water level in irrigation tank' },
                  { type: 'warning', message: 'Pesticide stock running low' },
                  { type: 'critical', message: 'Pest detection in Sector B' },
                  { type: 'info', message: 'Scheduled maintenance for Tractor X5000' }
                ]}
                onViewAllAlerts={() => console.log('View all alerts')}
              />
              <InventoryWidget
                items={[
                  { name: 'Wheat Seeds', quantity: '1500 kg', status: 'In Stock' },
                  { name: 'Urea Fertilizer', quantity: '500 kg', status: 'Low Stock' },
                  { name: 'Bio Pesticides', quantity: '30 ltr', status: 'In Stock' },
                  { name: 'Engine Oil', quantity: '250 ltr', status: 'Out of Stock' },
                  { name: 'Spare Parts', quantity: 'Various', status: 'In Stock' }
                ]}
                onOrder={() => console.log('Order clicked')}
                onManageInventory={() => console.log('Manage inventory')}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalyticsChartCard
                title="Sales Performance"
                description="Monthly sales data and trends"
                chartType="line"
                data={salesData}
              />
              <AnalyticsChartCard
                title="Profit Analysis"
                description="Revenue, expenses and profit breakdown"
                chartType="bar"
                data={salesData}
              />
              <AnalyticsChartCard
                title="Crop Yield Projections"
                description="Expected harvest outcomes"
                chartType="bar"
                data={cropYieldData}
              />
              <AnalyticsChartCard
                title="Stock Status"
                description="Inventory status visualization"
                chartType="area"
                data={salesData}
              />
              <AnalyticsChartCard
                title="Weather Forecast"
                description="24-hour temperature and precipitation"
                chartType="line"
                data={salesData}
              />
              <AnalyticsChartCard
                title="Soil Health Analysis"
                description="Current soil conditions vs. optimal ranges"
                chartType="area"
                data={[
                  { name: 'Moisture', value: 62 },
                  { name: 'pH', value: 65 },
                  { name: 'Nitrogen', value: 38 },
                  { name: 'Phosphorus', value: 30 },
                  { name: 'Potassium', value: 60 }
                ]}
              />
            </div>
          )}

          {activeTab === 'management' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CropManagementCard
                crops={[
                  { name: 'Wheat', health: 'Excellent' },
                  { name: 'Potatoes', health: 'Good' },
                  { name: 'Carrots', health: 'Good' },
                  { name: 'Onions', health: 'Fair' }
                ]}
              />
              <EquipmentMaintenanceCard
                equipment={[
                  { name: 'Massey Ferguson 7726', status: 'Active', maintenance: 'Maint: 7 days ✓' },
                  { name: 'Kubota M7-172', status: 'Maintenance', maintenance: 'Maint: 2 days ✓' },
                  { name: 'Drip Irrigation System', status: 'Active', maintenance: 'Maint: 15 days ✓' },
                  { name: 'Automated Seeder', status: 'Inactive', maintenance: 'Maint: Overdue ✓' }
                ]}
              />
              <IrrigationScheduleCard
                schedules={[
                  { field: 'Corn Field (North)', time: 'Today, 2:00 PM', duration: '40 minutes', waterUsage: '1,200 gallons' },
                  { field: 'Wheat Field (East)', time: 'Tomorrow, 8:00 AM', duration: '60 minutes', waterUsage: '4,500 gallons' },
                  { field: 'Tomato Greenhouse', time: 'Daily, 9:00 AM', duration: '15 minutes', waterUsage: '300 gallons' }
                ]}
                onScheduleNew={() => console.log('Schedule new irrigation')}
              />
              <HarvestCountdownCard
                harvests={[
                  { crop: 'Wheat', date: '15 Jul 2025', progress: 75, stage: 'Growth' },
                  { crop: 'Potatoes', date: '10 Aug 2025', progress: 60, stage: 'Flowering' },
                  { crop: 'Carrots', date: '25 Sep 2025', progress: 45, stage: 'Seedling' },
                  { crop: 'Onions', date: '10 Oct 2025', progress: 30, stage: 'Growth' }
                ]}
              />
            </div>
          )}
        </main>

        <footer className="bg-background border-t border-border px-6 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>© 2025 Farm Management. All rights reserved.</p>
            <p>All systems operational | AWS ✓ | Last Sync: Just now</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
