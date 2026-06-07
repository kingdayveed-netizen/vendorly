import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import Input from "@/components/ui/Input";
import { Store, CheckCircle, Clock } from "lucide-react";

interface StoreTabProps {
  profile: any;
  isEditing: boolean;
  formData: {
    storeName: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const StoreTab = ({
  profile,
  isEditing,
  formData,
  onFormChange,
}: StoreTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Store Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Store className="h-3 w-3" /> Store Name
            </label>
            {isEditing ? (
              <Input
                value={formData.storeName}
                onChange={(e) => onFormChange("storeName", e.target.value)}
              />
            ) : (
              <div>
                <p className="text-sm font-medium">{profile.storeName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your public store name
                </p>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Store URL
            </label>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">
                /store/{profile.storeSlug}
              </code>
              <Badge variant="outline" className="text-xs">
                Public
              </Badge>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">
              Verification Status
            </label>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              {profile.verified ? (
                <>
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium">Verified Account</p>
                    <p className="text-xs text-muted-foreground">
                      Your account is verified and trusted
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Pending Verification</p>
                    <p className="text-xs text-muted-foreground">
                      Complete verification to build trust
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Member Since
            </label>
            <p className="text-sm font-medium">
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};