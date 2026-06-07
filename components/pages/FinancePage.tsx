"use client";

import { useState, useMemo, useCallback } from "react";
import { useFinance } from "@/hooks/useFinance";
import { OverviewCards } from "../finances/OverviewCards";
import { TopCustomersTable } from "../finances/TopCustomerTable";
import { DailyRevenueChart } from "../finances/RevenueChart";
import { CustomerDetailModal } from "../finances/CustomerDetailModal";
import Button from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

export default function FinancePage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );

  const {
    overview,
    topCustomers,
    selectedCustomerDetail,
    dailyRevenue,
    isLoadingOverview,
    isLoadingTopCustomers,
    isLoadingCustomerDetail,
    isLoadingDailyRevenue,
    dailyRevenueDays,
    fetchCustomerDetail,
    updateTopCustomersLimit,
    updateDailyRevenueDays,
    clearSelected,
    refreshAll,
    refetchOverview,
    refetchTopCustomers,
    refetchDailyRevenue,
  } = useFinance();

  // Formatting utilities (memoized to prevent recreation)
  const formatCurrency = useCallback((amount: number = 0): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatDate = useCallback((date: string | null): string => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const getInitials = useCallback((name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Handlers
  const handleViewCustomer = useCallback(
    (customerId: string) => {
      setSelectedCustomerId(customerId);
      fetchCustomerDetail(customerId);
    },
    [fetchCustomerDetail],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedCustomerId(null);
    clearSelected();
  }, [clearSelected]);

  const handleLimitChange = useCallback(
    (limit: number) => {
      updateTopCustomersLimit(limit);
    },
    [updateTopCustomersLimit],
  );

  const handleDaysChange = useCallback(
    (days: number) => {
      updateDailyRevenueDays(days);
    },
    [updateDailyRevenueDays],
  );

  const handleRefresh = useCallback(() => {
    refreshAll();
  }, [refreshAll]);

  const handleRefreshOverview = useCallback(() => {
    refetchOverview();
  }, [refetchOverview]);

  const handleRefreshTopCustomers = useCallback(() => {
    refetchTopCustomers();
  }, [refetchTopCustomers]);

  const handleRefreshDailyRevenue = useCallback(() => {
    refetchDailyRevenue();
  }, [refetchDailyRevenue]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Finance Overview</h1>
            <p className="text-sm text-gray-500">
              Track your revenue and top customers
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </Button>
        </div>

        {/* Overview Cards */}
        <OverviewCards
          data={overview}
          isLoading={isLoadingOverview}
          formatCurrency={formatCurrency}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Customers Table - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <TopCustomersTable
              data={topCustomers}
              isLoading={isLoadingTopCustomers}
              onViewCustomer={handleViewCustomer}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getInitials={getInitials}
            />
          </div>

          {/* Daily Revenue Chart - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <DailyRevenueChart
              data={dailyRevenue}
              isLoading={isLoadingDailyRevenue}
              onDaysChange={handleDaysChange}
              days={dailyRevenueDays}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>

        {/* Customer Detail Modal */}
        <CustomerDetailModal
          customer={selectedCustomerDetail}
          isLoading={isLoadingCustomerDetail}
          onClose={handleCloseModal}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getInitials={getInitials}
        />
      </div>
    </div>
  );
}
