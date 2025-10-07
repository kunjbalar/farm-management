import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Square } from "lucide-react";

interface FarmerProfileSidebarProps {
  farmerName: string;
  farmName: string;
  farmLocation: string;
  totalArea: string;
  contact: string;
  onEditProfile: () => void;
}

export default function FarmerProfileSidebar({
  farmerName,
  farmName,
  farmLocation,
  totalArea,
  contact,
  onEditProfile
}: FarmerProfileSidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col">
      <h2 className="text-lg font-semibold text-sidebar-foreground mb-6">Farmer Profile</h2>
      
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {farmerName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-sidebar-foreground text-center" data-testid="text-farmer-name">{farmerName}</h3>
        <p className="text-sm text-muted-foreground">Premium Farmer Owner</p>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <h4 className="text-sm font-medium text-sidebar-foreground mb-1">Farm Location</h4>
          <p className="text-sm text-muted-foreground" data-testid="text-farm-location">{farmLocation}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-sidebar-foreground mb-1">Total Area</h4>
          <p className="text-sm text-muted-foreground" data-testid="text-total-area">{totalArea}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-sidebar-foreground mb-1">Contact</h4>
          <p className="text-sm text-muted-foreground" data-testid="text-contact">{contact}</p>
        </div>
      </div>

      <Button 
        onClick={onEditProfile} 
        className="w-full mt-6"
        data-testid="button-edit-profile"
      >
        Edit Profile
      </Button>
    </div>
  );
}
