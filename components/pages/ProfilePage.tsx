"use client";

import { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileInfoTab } from "@/components/profile/tabs/ProfileInfoTabs";
import { SecurityTab } from "@/components/profile/tabs/SecurityTabs";
import { StoreTab } from "@/components/profile/tabs/StoreTabs";
import { User } from "lucide-react";

// Helper function to get full image URL
const getImageUrl = (path: string | undefined) => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const imagePath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${imagePath}`;
};

export default function ProfilePage() {
  const {
    profile,
    isLoading,
    isUpdating,
    updateVendorProfile,
    changePassword,
    uploadImage,
  } = useProfile();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    storeName: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Memoized functions
  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return `₦${amount.toLocaleString()}`;
  }, []);

  // Handlers
  const handleEdit = useCallback(() => {
    if (!profile) return;
    setFormData({
      fullName: profile.fullName,
      phone: profile.phone,
      location: profile.location || "",
      storeName: profile.storeName,
    });
    setIsEditing(true);
  }, [profile]);

  const handleSave = async () => {
    await updateVendorProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleFormChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePasswordChange = useCallback((field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        await uploadImage(file);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handlePasswordSubmit = useCallback(async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    await changePassword(passwordData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [passwordData, changePassword]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-muted rounded-full mb-4">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
            <p className="text-sm text-muted-foreground text-center">
              We couldn't find your profile information. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader
          verified={profile.verified}
          isEditing={isEditing}
          onEdit={handleEdit}
        />

        {/* Profile Overview Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          <CardContent className="relative px-8 pb-8">
            <div className="flex items-start gap-8 -mt-12">
              <ProfileAvatar
                profileImage={profile.profileImage}
                fullName={profile.fullName}
                isUploading={isUploadingImage}
                onImageUpload={handleImageUpload}
                getImageUrl={getImageUrl}
                getInitials={getInitials}
              />
              <ProfileInfo
                fullName={profile.fullName}
                storeName={profile.storeName}
                email={profile.email}
                phone={profile.phone}
                location={profile.location}
                createdAt={profile.createdAt}
                totalRevenue={profile.totalRevenue}
              />
            </div>
          </CardContent>
        </Card>

        <ProfileStats
          totalProducts={profile.totalProducts}
          totalOrders={profile.totalOrders}
          totalRevenue={profile.totalRevenue}
          formatCurrency={formatCurrency}
        />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="store">Store Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileInfoTab
              profile={profile}
              isEditing={isEditing}
              isUpdating={isUpdating}
              formData={formData}
              onFormChange={handleFormChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab
              passwordData={passwordData}
              isUpdating={isUpdating}
              onPasswordChange={handlePasswordChange}
              onSubmit={handlePasswordSubmit}
            />
          </TabsContent>

          <TabsContent value="store">
            <StoreTab
              profile={profile}
              isEditing={isEditing}
              formData={formData}
              onFormChange={handleFormChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
