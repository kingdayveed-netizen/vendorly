import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VendorProfile } from "@/types/profile";

export interface ProfileState {
  profile: VendorProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProfile: (state, action: PayloadAction<VendorProfile | null>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<VendorProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setUpdating,
  setError,
  setProfile,
  updateProfile,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
