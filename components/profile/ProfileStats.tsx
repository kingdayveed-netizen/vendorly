import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

interface ProfileStatsProps {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  formatCurrency: (amount: number) => string;
}

export const ProfileStats = ({
  totalProducts,
  totalOrders,
  totalRevenue,
  formatCurrency,
}: ProfileStatsProps) => {
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-primary",
      subtext: "Items in store",
    },
    {
      label: "Completed Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-emerald-500",
      subtext: "Successfully delivered",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-amber-500",
      subtext: "Lifetime earnings",
    },
    {
      label: "Avg. Order Value",
      value: formatCurrency(avgOrderValue),
      icon: TrendingUp,
      color: "text-purple-500",
      subtext: "Per transaction",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};