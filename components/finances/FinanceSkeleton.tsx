import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";

export const OverviewCardsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const TopCustomersTableSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const DailyRevenueChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-32" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-64 w-full rounded-lg" />
    </CardContent>
  </Card>
);

export const CustomerDetailSkeleton = () => (
  <div className="space-y-4">
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
