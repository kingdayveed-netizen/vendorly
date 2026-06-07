"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export const CustomerHeader = () => {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9"
          onClick={() => router.push("/dashboard/customers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Customer Profile</h1>
          <p className="text-sm text-gray-500">
            View customer information and order history
          </p>
        </div>
      </div>
    </div>
  );
};