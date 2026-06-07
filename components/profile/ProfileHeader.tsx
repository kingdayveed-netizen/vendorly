import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Edit3, CheckCircle, Clock } from "lucide-react";

interface ProfileHeaderProps {
  verified: boolean;
  isEditing: boolean;
  onEdit: () => void;
}

export const ProfileHeader = ({
  verified,
  isEditing,
  onEdit,
}: ProfileHeaderProps) => {
  const getStatusBadge = () => {
    if (verified) {
      return (
        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-amber-100 text-amber-700 hover:bg-amber-200"
      >
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and store settings
        </p>
      </div>
      <div className="flex items-center gap-3">
        {getStatusBadge()}
        {!isEditing && (
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};
