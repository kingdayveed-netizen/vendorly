import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Lock } from "lucide-react";

interface SecurityTabProps {
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  isUpdating: boolean;
  onPasswordChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export const SecurityTab = ({
  passwordData,
  isUpdating,
  onPasswordChange,
  onSubmit,
}: SecurityTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Current Password
            </label>
            <Input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => onPasswordChange("currentPassword", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              New Password
            </label>
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => onPasswordChange("newPassword", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => onPasswordChange("confirmPassword", e.target.value)}
            />
          </div>
          <Button onClick={onSubmit} disabled={isUpdating} className="mt-2">
            <Lock className="h-4 w-4 mr-2" />
            {isUpdating ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};