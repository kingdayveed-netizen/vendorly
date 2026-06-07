import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean; 
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.initialized = true;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.initialized = true;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state) => {
      state.initialized = true;
      state.isLoading = false;
    },
  },
});

export const {
  setCredentials,
  logout,
  updateUser,
  setAuthLoading,
  setInitialized,
} = authSlice.actions;

export default authSlice.reducer;
