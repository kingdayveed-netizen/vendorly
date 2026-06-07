"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

export const CustomerSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-9 w-9" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Profile Card Skeleton */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="h-10 w-[300px] mb-4" />

      {/* Content Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full md:col-span-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);