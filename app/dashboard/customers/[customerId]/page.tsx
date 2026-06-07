"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { User, ArrowLeft } from "lucide-react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  CreditCard,
} from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { CustomerHeader } from "@/components/customers/CustomerHeader";
import { CustomerProfileCard } from "@/components/customers/CustomerProfileCard";
import { CustomerStats } from "@/components/customers/CustomerStats";
import { ContactInfo } from "@/components/customers/ContactInfo";
import { RecentOrders } from "@/components/customers/RecentOrders";
import { OrdersTable } from "@/components/customers/OrdersTable";
import { CustomerDetails } from "@/components/customers/CustomerDetails";
import { CustomerSkeleton } from "@/components/customers/CustomerSkeleton";

export default function CustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.customerId as string;
  const [activeTab, setActiveTab] = useState("overview");

  const {
    selectedCustomer,
    isLoadingCustomer,
    customerOrdersQuery,
    customerOrders,
    isLoadingCustomerOrders,
  } = useCustomer(customerId);

  useEffect(() => {
    if (customerId) {
      fetchCustomerOrders();
    }
  }, [customerId]);

  const fetchCustomerOrders = async () => {
    try {
      await customerOrdersQuery.refetch();
    } catch (error) {
      console.error("Error fetching customer orders:", error);
    }
  };

  const formatCurrency = (amount: number = 0): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      delivered: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
      },
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      },
      processing: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Package,
      },
      cancelled: {
        color: "bg-rose-50 text-rose-700 border-rose-200",
        icon: XCircle,
      },
      shipped: {
        color: "bg-purple-50 text-purple-700 border-purple-200",
        icon: Truck,
      },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      paid: "bg-emerald-50 text-emerald-700",
      pending: "bg-amber-50 text-amber-700",
      failed: "bg-rose-50 text-rose-700",
    };

    return (
      <Badge
        variant="secondary"
        className={`${statusConfig[status] || statusConfig.pending}`}
      >
        <CreditCard className="h-3 w-3 mr-1" />
        {/* {status.charAt(0).toUpperCase() + status.slice(1)} */}
      </Badge>
    );
  };

  if (isLoadingCustomer) {
    return <CustomerSkeleton />;
  }

  if (!selectedCustomer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <CustomerNotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <CustomerHeader />

        <CustomerProfileCard
          customer={selectedCustomer}
          formatDate={formatDate}
          getInitials={getInitials}
        />

        <CustomerStats
          stats={selectedCustomer}
          orders={selectedCustomer.orders}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ContactInfo
                email={selectedCustomer.email}
                phone={selectedCustomer.phone}
                address={selectedCustomer.address}
              />

              <RecentOrders
                orders={customerOrders}
                isLoading={isLoadingCustomerOrders}
                onViewAll={() => setActiveTab("orders")}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
              />
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTable
              orders={customerOrders}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadge={getStatusBadge}
              getPaymentStatusBadge={getPaymentStatusBadge}
            />
          </TabsContent>

          <TabsContent value="details">
            <CustomerDetails
              customer={selectedCustomer}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// CustomerNotFound component
const CustomerNotFound = () => {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <User className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Customer not found</h3>
        <p className="text-sm text-gray-500 mb-6">
          The customer you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/dashboard/customers")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
      </CardContent>
    </Card>
  );
};
