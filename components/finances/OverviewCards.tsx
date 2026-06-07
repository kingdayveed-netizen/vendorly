"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { RevenueOverview } from "@/types/finance";
import { OverviewCardsSkeleton } from "./FinanceSkeleton";

interface OverviewCardsProps {
  data: RevenueOverview | null;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
}

export const OverviewCards = ({ data, isLoading, formatCurrency }: OverviewCardsProps) => {
  if (isLoading) return <OverviewCardsSkeleton />;
  if (!data) return null;

  const cards = [
    { label: "Total Revenue", value: formatCurrency(data.totalRevenue), color: "text-primary" },
    { label: "Monthly Revenue", value: formatCurrency(data.monthlyRevenue), color: "text-emerald-600" },
    { label: "Avg. Order Value", value: formatCurrency(data.averageOrderValue), color: "text-amber-600" },
    { label: "Total Customers", value: data.totalCustomers.toString(), color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-lg font-semibold ${card.color}`}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};