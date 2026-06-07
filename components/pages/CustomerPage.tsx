"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Users,
  UserPlus,
  Eye,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Download,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CustomersPage = () => {
  const router = useRouter();
  const {
    customers,
    stats,
    isLoading,
    filters,
    updateFilters,
    refetchCustomers,
  } = useCustomer();

  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    refetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewCustomer = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number = 0): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading && !customers.length) {
    return <CustomersPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Customers
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              View and manage your customer relationships
            </p>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form onSubmit={handleSearch} className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-9 pr-4 w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() =>
                      updateFilters({ sortBy: "createdAt", sortOrder: "desc" })
                    }
                  >
                    Newest first
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateFilters({ sortBy: "createdAt", sortOrder: "asc" })
                    }
                  >
                    Oldest first
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateFilters({
                        sortBy: "totalOrders",
                        sortOrder: "desc",
                      })
                    }
                  >
                    Most orders
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateFilters({ sortBy: "totalSpent", sortOrder: "desc" })
                    }
                  >
                    Highest spending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="gap-2" disabled>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Customers
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mt-2">
                    {stats?.totalCustomers?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lifetime customers
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Customers
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mt-2">
                    {customers
                      .filter((c) => c.totalOrders > 0)
                      .length.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Have placed orders
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    New This Month
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold mt-2">
                    {stats?.newCustomers30d?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">Last 30 days</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-full">
                  <UserPlus className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table - With horizontal scroll on mobile/tablet */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold whitespace-nowrap">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-center whitespace-nowrap">
                    Orders
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    Total Spent
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    Last Order
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    Joined
                  </TableHead>
                  <TableHead className="font-semibold text-right whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewCustomer(customer.id)}
                    >
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-muted flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {getInitials(customer.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.fullName}</p>
                            {customer.email && (
                              <p className="text-xs text-muted-foreground hidden lg:block">
                                {customer.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {customer.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">{customer.phone}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <Badge variant="secondary" className="font-mono">
                          {customer.totalOrders}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-primary whitespace-nowrap">
                        {formatCurrency(customer.totalSpent)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {customer.lastOrderDate ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">
                              {formatDate(customer.lastOrderDate)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Never
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(customer.createdAt)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewCustomer(customer.id);
                                  }}
                                >
                                  <Eye className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {customer.email && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 w-9"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `mailto:${customer.email}`;
                                    }}
                                    disabled
                                  >
                                    <Mail className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Send email</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-muted/50 rounded-full mb-4">
                          <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">
                          No customers found
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {filters.search
                            ? "Try adjusting your search or filters"
                            : "When customers place orders, they'll appear here"}
                        </p>
                        {filters.search && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchInput("");
                              updateFilters({ search: "", page: 1 });
                            }}
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {customers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                  {Math.min(filters.page * filters.limit, customers.length)} of{" "}
                  {customers.length} results
                </span>
                <Select
                  value={filters.limit.toString()}
                  onValueChange={(value: string) => {
                    updateFilters({ limit: Number(value), page: 1 });
                  }}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(1)}
                  disabled={filters.page === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm px-3 py-1 bg-muted rounded-md min-w-[80px] text-center">
                  Page {filters.page}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={
                    filters.page === Math.ceil(customers.length / filters.limit)
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8"
                  onClick={() =>
                    handlePageChange(
                      Math.ceil(customers.length / filters.limit),
                    )
                  }
                  disabled={
                    filters.page === Math.ceil(customers.length / filters.limit)
                  }
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Mobile Card View (Alternative for very small screens if needed) */}
        <div className="lg:hidden mt-4">
          <p className="text-sm text-muted-foreground mb-2">
            Swipe horizontally to see more columns →
          </p>
        </div>
      </div>
    </div>
  );
};

// Improved Skeleton Loader
const CustomersPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default CustomersPage;
