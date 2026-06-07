"use client";

import { Mail, Phone, Award } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/Card";

interface CustomerProfileCardProps {
  customer: {
    fullName: string;
    createdAt: string;
    email?: string;
    phone?: string;
    totalSpent: number;
  };
  formatDate: (date: string) => string;
  getInitials: (name: string) => string;
}

export const CustomerProfileCard = ({ 
  customer, 
  formatDate, 
  getInitials 
}: CustomerProfileCardProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {getInitials(customer.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-semibold">{customer.fullName}</h2>
              {customer.totalSpent >= 100000 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Award className="h-3 w-3 mr-1" />
                  VIP
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Customer since {formatDate(customer.createdAt)}
            </p>
            <div className="flex gap-2 mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 w-9" disabled>
                      <Mail className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send email</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {customer.phone && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 w-9" disabled>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Call customer</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};