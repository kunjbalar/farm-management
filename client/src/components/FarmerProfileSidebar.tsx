import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Square, User, Leaf, Phone, Camera } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FarmerProfileSidebarProps {
  farmerName: string;
  farmName: string;
  farmLocation: string;
  totalArea: string;
  contact: string;
  onEditProfile: () => void;
  user: any;
  onUserUpdate: (user: any) => void;
}

export default function FarmerProfileSidebar({
  farmerName,
  farmName,
  farmLocation,
  totalArea,
  contact,
  onEditProfile,
  user,
  onUserUpdate
}: FarmerProfileSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editName, setEditName] = useState(user.name || "");
  const [editFarmName, setEditFarmName] = useState(user.farmName || "");
  const [editFarmLocation, setEditFarmLocation] = useState(user.farmLocation || "");
  const [editTotalArea, setEditTotalArea] = useState(user.totalArea || "");
  const [editContact, setEditContact] = useState(user.contact || "");
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();  

  const handleEditClick = () => {
    setEditName(user.name || "");
    setEditFarmName(user.farmName || "");
    setEditFarmLocation(user.farmLocation || "");
    setEditTotalArea(user.totalArea || "");
    setEditContact(user.contact || "");
    setProfilePhoto(user.profilePhoto || "");
    setIsDialogOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 2MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("PUT", "/api/user", {
        name: editName,
        farmName: editFarmName,
        farmLocation: editFarmLocation,
        totalArea: editTotalArea,
        contact: editContact,
        profilePhoto: profilePhoto,
      });


      const updatedUser = await response.json();
      onUserUpdate(updatedUser);
      setIsDialogOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex-shrink-0 bg-sidebar border-b border-sidebar-border p-6 flex flex-col lg:w-64 lg:border-b-0 lg:border-r">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-6">Farmer Profile</h2>
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user.profilePhoto || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {farmerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="font-semibold text-sidebar-foreground text-center" data-testid="text-farmer-name">{farmerName}</h3>
          <p className="text-sm text-muted-foreground"> Farm Owner</p>
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
          onClick={handleEditClick} 
          className="w-full mt-6"
          data-testid="button-edit-profile"
        >
          Edit Profile
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-edit-profile">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profilePhoto || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {editName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Click camera to change photo</p>
            </div>
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="pl-10"
                  data-testid="input-edit-name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-farm-name">Farm Name</Label>
              <div className="relative mt-1">
                <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit-farm-name"
                  value={editFarmName}
                  onChange={(e) => setEditFarmName(e.target.value)}
                  className="pl-10"
                  data-testid="input-edit-farm-name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-farm-location">Farm Location</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit-farm-location"
                  value={editFarmLocation}
                  onChange={(e) => setEditFarmLocation(e.target.value)}
                  className="pl-10"
                  data-testid="input-edit-farm-location"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-total-area">Total Area</Label>
              <div className="relative mt-1">
                <Square className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit-total-area"
                  value={editTotalArea}
                  onChange={(e) => setEditTotalArea(e.target.value)}
                  placeholder="e.g., 4 Hectare (10 acres)"
                  className="pl-10"
                  data-testid="input-edit-total-area"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-contact">Contact</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit-contact"
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  className="pl-10"
                  data-testid="input-edit-contact"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel-edit">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} data-testid="button-save-profile">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
