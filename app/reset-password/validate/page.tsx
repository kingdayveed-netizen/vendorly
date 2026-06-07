"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import { Eye, EyeOff } from "lucide-react";

// Updated password validation with proper regex
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { resetPassword } = useAuth();

  // Extract token from URL query parameters
  const token = searchParams.get("token");

  // Step 1: Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        showToast("Invalid reset link", "error");
        router.push("/forgot-password");
        return;
      }

      setResetToken(token);

      try {
        const response = await axiosInstance.get(
          `/auth/reset-password/validate?token=${token}`,
        );

        if (response.data.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          showToast(
            response.data.message || "Invalid or expired reset link",
            "error",
          );
        }
      } catch (error: any) {
        setIsTokenValid(false);
        showToast(
          error.response?.data?.message || "Invalid or expired reset link",
          "error",
        );
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, router, showToast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  // Step 2: Submit new password
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!resetToken) return;

    try {
      setIsLoading(true);
      const result = await resetPassword(resetToken, data.password);

      if (result.success) {
        setIsSuccess(true);
        showToast(result.message, "success");

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        showToast(result.message, "error");
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to reset password",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
                Vendorly
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Validating your link...
            </h2>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state if token is invalid
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
                Vendorly
              </span>
            </div>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">!</span>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              This password reset link is invalid or has expired.
            </p>
            <div className="mt-6">
              <Link href="/forgot-password">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Request New Reset Link
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state after password reset
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
                Vendorly
              </span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-800 mb-2 font-semibold">
                Password Reset Successful!
              </p>
              <p className="text-sm text-gray-600">
                Your password has been reset successfully. You can now login
                with your new password.
              </p>
            </div>
            <Link href="/login">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main form - show password inputs
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
              Vendorly
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create New Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-800 mb-2"
            >
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold text-gray-800 mb-2"
            >
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="text-green-500 hover:underline">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}