import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { profileService } from "@/app/services/profile.service";
import {
  setLoading,
  setUpdating,
  setError,
  setProfile,
  updateProfile,
  clearProfile,
} from "@/redux/slices/profileSlice";
import { UpdateProfileData, ChangePasswordData } from "@/types/profile";
import { toast } from "sonner";

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading, isUpdating, error } = useSelector(
    (state: RootState) => state.profile,
  );

  // Fetch profile
  const fetchProfile = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await profileService.getProfile();
      dispatch(setProfile(data));
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch profile"),
      );
      toast.error("Failed to load profile");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Update profile
  const updateVendorProfile = async (data: UpdateProfileData) => {
    try {
      dispatch(setUpdating(true));
      dispatch(setError(null));
      const updatedProfile = await profileService.updateProfile(data);
      dispatch(setProfile(updatedProfile));
      toast.success("Profile updated successfully");
      return updatedProfile;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setUpdating(false));
    }
  };

  // Change password
  const changePassword = async (data: ChangePasswordData) => {
    try {
      dispatch(setUpdating(true));
      dispatch(setError(null));
      await profileService.changePassword(data);
      toast.success("Password changed successfully");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to change password";
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setUpdating(false));
    }
  };

  // Upload profile image
  const uploadImage = async (file: File) => {
    try {
      dispatch(setUpdating(true));
      dispatch(setError(null));
      const { profileImage } = await profileService.uploadProfileImage(file);
      dispatch(updateProfile({ profileImage }));
      toast.success("Profile image updated");
      return profileImage;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to upload image";
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setUpdating(false));
    }
  };

  // Clear profile (logout)
  const handleClearProfile = () => {
    dispatch(clearProfile());
  };

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    // Data
    profile,
    isLoading,
    isUpdating,
    error,

    // Actions
    fetchProfile,
    updateVendorProfile,
    changePassword,
    uploadImage,
    clearProfile: handleClearProfile,
  };
};
