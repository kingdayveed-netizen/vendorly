import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="flex justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Profile Card Skeleton */}
      <Card className="mb-8">
        <Skeleton className="h-24 w-full" />
        <CardContent className="p-8">
          <div className="flex gap-8 -mt-12">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Contact Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="h-10 w-64 mb-4" />

      {/* Content Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
