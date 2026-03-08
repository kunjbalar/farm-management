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
      <aside className="w-full flex-shrink-0 border-b border-sidebar-border/70 bg-sidebar/90 p-4 sm:p-2 lg:w-80 lg:border-b-0 lg:border-r lg:overflow-y-auto">
       
        

           <div className="flex my-3 mx-1 min-w-0 items-center gap-3">
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
         

        <div className="mb-6 flex flex-col items-center rounded-2xl border border-sidebar-border/70 bg-card/50 p-5 text-center">
          <Avatar className="mb-4 h-24 w-24 ring-4 ring-primary/10">
            <AvatarImage src={user.profilePhoto || ""} />
            <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
              {farmerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold text-sidebar-foreground" data-testid="text-farmer-name">{farmerName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Farm Owner</p>
          <p className="mt-2 max-w-[220px] truncate text-xs text-muted-foreground">{farmName}</p>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-xl border border-sidebar-border/60 bg-card/40 p-3">
            <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Farm Name</h4>
            <p className="truncate text-sm text-sidebar-foreground">{farmName}</p>
          </div>
          <div className="rounded-xl border border-sidebar-border/60 bg-card/40 p-3">
            <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Farm Location</h4>
            <p className="truncate text-sm text-sidebar-foreground" data-testid="text-farm-location">{farmLocation}</p>
          </div>
          <div className="rounded-xl border border-sidebar-border/60 bg-card/40 p-3">
            <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Area</h4>
            <p className="truncate text-sm text-sidebar-foreground" data-testid="text-total-area">{totalArea}</p>
          </div>
          <div className="rounded-xl border border-sidebar-border/60 bg-card/40 p-3">
            <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Contact</h4>
            <p className="truncate text-sm text-sidebar-foreground" data-testid="text-contact">{contact}</p>
          </div>
        </div>

        <Button
          onClick={handleEditClick}
          className="mt-6 w-full"
          data-testid="button-edit-profile"
        >
          Edit Profile
        </Button>
      </aside>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-edit-profile">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profilePhoto || ""} />
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                    {editName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
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
              <p className="mt-2 text-xs text-muted-foreground">Click camera to change photo</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <Leaf className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <Square className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

              <div className="sm:col-span-2">
                <Label htmlFor="edit-contact">Contact</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
