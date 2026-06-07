"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const { verifyEmail, verificationStatus, resendVerificationEmail } =
    useAuth();
  const { showToast } = useToast(); 

  // Store token in ref to prevent loss on re-renders
  const tokenRef = useRef<string | null>(null); 
  const emailRef = useRef<string | null>(null);
  const hasVerifiedRef = useRef(false);   

  // Get values once and store them
  useEffect(() => {
    tokenRef.current = searchParams.get("token");
    emailRef.current = searchParams.get("email");
  }, [searchParams]);

  useEffect(() => {
    // Only verify if we have a token and haven't already verified
    if (
      tokenRef.current &&
      !hasVerifiedRef.current &&
      !verificationStatus.loading &&
      !verificationStatus.success &&
      !verificationStatus.error
    ) {
      hasVerifiedRef.current = true;
      verifyEmail(tokenRef.current);
    }
  }, [verifyEmail, verificationStatus]);

  const handleResend = async () => {
    if (emailRef.current) {
      const result = await resendVerificationEmail(emailRef.current);
      if (result.success) {
        showToast("Verification email resent!", "success");
      } else {
        showToast(result.message, "error");
      }
    }
  };

  // Show nothing while reading token
  if (
    !tokenRef.current &&
    !verificationStatus.loading &&
    !verificationStatus.success &&
    !verificationStatus.error
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Link
          href="/"
          className="fixed top-8 left-8 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="h-16 w-16 text-green-500 animate-spin mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Loading...</h1>
        </div>
      </div>
    );
  }

  // Loading state
  if (verificationStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Link
          href="/"
          className="fixed top-8 left-8 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="h-16 w-16 text-green-500 animate-spin mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Verifying your email...
          </h1>
          <p className="text-gray-600 mt-2">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (verificationStatus.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Link
          href="/"
          className="fixed top-8 left-8 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Email Verified!
          </h1>
          <p className="text-gray-600 mt-2">
            Your email has been successfully verified.
          </p>
          <div className="mt-6">
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

  // Error state
  if (verificationStatus.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Link
          href="/"
          className="fixed top-8 left-8 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Verification Failed
          </h1>
          <p className="text-red-600 mt-2">{verificationStatus.error}</p>

          {emailRef.current && (
            <div className="mt-6">
              <button
                onClick={handleResend}
                className="text-sm text-green-500 hover:text-green-600 hover:underline"
              >
                Resend verification email
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // No token state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Link
        href="/"
        className="fixed top-8 left-8 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back to Home</span>
      </Link>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="h-16 w-16 text-yellow-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Invalid Link</h1>
        <p className="text-gray-600 mt-2">
          Please check your email for a valid verification link.
        </p>
      </div>
    </div>
  );
}
