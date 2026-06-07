"use client";

import AddProductForm from "@/components/forms/AddProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
      </div>

      <AddProductForm />
    </div>
  );
}
