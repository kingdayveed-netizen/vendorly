"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  setCredentials,
  logout,
  setAuthLoading,
} from "@/redux/slices/authSlice";
import { User } from "@/types/user";
import axiosInstance from "@/lib/axios";
import {
  clearAuthTokens,
  getRefreshToken,
  storeAuthTokens,
} from "@/lib/authTokens";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type AuthResponse = {
  user: User;
  token?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [verificationStatus, setVerificationStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  // Define auth pages where we don't want to check auth
  const authPages = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verifyEmail",
    "/reset-password/validate",
  ];

  const isAuthPage = authPages.includes(pathname);

  // Check authentication status on mount, but skip on auth pages
  useEffect(() => {
    if (isAuthPage) {
      dispatch(setAuthLoading(false));
      return;
    }

    if (user) {
      dispatch(setAuthLoading(false));
      return;
    }

    checkAuthStatus();
  }, [isAuthPage, user]);

  const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      dispatch(setCredentials({ user: response.data.user }));
    } catch (error) {
      dispatch(logout());
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ user: User }> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    storeAuthTokens(response.data.token);
    dispatch(setCredentials({ user: response.data.user }));
    return response.data;
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    role: "VENDOR" | "CUSTOMER",
    storeName?: string,
    phone?: string,
    location?: string,
  ): Promise<{ user: User }> => {
    const payload: any = { fullName, email, password, role, phone, location };
    if (role === "VENDOR") {
      payload.storeName = storeName;
    }
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    storeAuthTokens(response.data.token);
    dispatch(setCredentials({ user: response.data.user }));
    return response.data;
  };

  const verifyEmail = async (
    token: string,
  ): Promise<{ success: boolean; message: string }> => {
    setVerificationStatus({ loading: true, error: null, success: false });

    try {
      const response = await axiosInstance.get(
        `/auth/verify-email?token=${token}`,
      );
      console.log(response);

      setVerificationStatus({ loading: false, error: null, success: true });
      return { success: true, message: response.data.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to verify email";
      setVerificationStatus({
        loading: false,
        error: errorMessage,
        success: false,
      });
      return { success: false, message: errorMessage };
    }
  };

  const resendVerificationEmail = async (
    email: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      await axiosInstance.post("/auth/resend-verification", { email });
      return { success: true, message: "Verification email resent!" };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend email";
      return { success: false, message: errorMessage };
    }
  };

  const forgotPassword = async (
    email: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      return {
        success: true,
        message:
          response.data.message || "Password reset link sent to your email!",
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset link";
      return { success: false, message: errorMessage };
    }
  };

  const resetPassword = async (
    token: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        token,
        password,
      });
      return {
        success: true,
        message: response.data.message || "Password reset successful!",
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      return { success: false, message: errorMessage };
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      clearAuthTokens();
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
      clearAuthTokens();
      dispatch(logout());
    }
  };

  const refreshTokens = async () => {
    try {
      const refreshToken = getRefreshToken();
      const response = await axiosInstance.post(
        "/auth/refresh",
        refreshToken ? { refreshToken } : undefined,
      );
      storeAuthTokens(response.data.token);
      dispatch(setCredentials({ user: response.data.user }));
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    verificationStatus,
    login,
    signup,
    logout: handleLogout,
    verifyEmail,
    resendVerificationEmail,
    refreshTokens,
    checkAuthStatus,
    forgotPassword,
    resetPassword,
  };
};
