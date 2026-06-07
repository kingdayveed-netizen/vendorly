"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Short timeout to ensure hydration is complete
    const timer = setTimeout(() => {
      if (!user) {
        router.push("/signup");
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, router]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-pulse space-y-6 max-w-md w-full">
          {/* Logo/Icon skeleton */}
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-green-100 rounded-full"></div>
          </div>

          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>

          {/* Message skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
          </div>

          {/* Button skeleton */}
          <div className="pt-4">
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user exists, show the verification message
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-50 to-white">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="h-10 w-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800">Check your email</h1>

          {/* Email highlight */}
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-green-700 font-medium break-all">{user.email}</p>
          </div>

          {/* Message */}
          <div className="space-y-2 text-gray-600">
            <p>We've sent a verification link to your email address.</p>
            <p className="text-sm">
              Click the link in the email to verify your account and complete
              your registration.
            </p>
          </div>

          {/* Help text */}
          <div className="text-sm text-gray-500 border-t border-gray-100 pt-4">
            <p>Didn't receive the email? Check your spam folder or</p>
            <button
              className="text-green-500 hover:text-green-600 font-medium hover:underline"
              onClick={() => {
                /* Add resend logic here */
              }}
            >
              click here to resend
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Page;
