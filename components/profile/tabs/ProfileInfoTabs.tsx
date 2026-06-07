import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Save, User, Mail, Phone, MapPin } from "lucide-react";

interface ProfileInfoTabProps {
  profile: any;
  isEditing: boolean;
  isUpdating: boolean;
  formData: {
    fullName: string;
    phone: string;
    location: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileInfoTab = ({
  profile,
  isEditing,
  isUpdating,
  formData,
  onFormChange,
  onSave,
  onCancel,
}: ProfileInfoTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <User className="h-3 w-3" /> Full Name
            </label>
            {isEditing ? (
              <Input
                value={formData.fullName}
                onChange={(e) => onFormChange("fullName", e.target.value)}
              />
            ) : (
              <p className="text-sm font-medium">{profile.fullName}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Mail className="h-3 w-3" /> Email Address
            </label>
            <p className="text-sm font-medium text-muted-foreground">
              {profile.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Phone className="h-3 w-3" /> Phone Number
            </label>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) => onFormChange("phone", e.target.value)}
              />
            ) : (
              <p className="text-sm font-medium">{profile.phone}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Location
            </label>
            {isEditing ? (
              <Input
                value={formData.location}
                onChange={(e) => onFormChange("location", e.target.value)}
                placeholder="Enter your location"
              />
            ) : (
              <p className="text-sm font-medium">
                {profile.location || "Not set"}
              </p>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex gap-2 pt-6 mt-4 border-t">
            <Button onClick={onSave} disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};