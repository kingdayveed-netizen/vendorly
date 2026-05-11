"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Save, ChevronDown, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { useProduct } from "@/hooks/useProducts";
import { useToast } from "@/components/ui/Toast";
import { Product } from "@/types/product";

const editProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  images: z.any().optional(),
});

type EditProductFormData = z.infer<typeof editProductSchema>;

// Predefined categories (same as AddProductForm)
const categories = [
  { value: "Clothing", label: "👕 Clothing" },
  { value: "Electronics", label: "📱 Electronics" },
  { value: "Accessories", label: "💍 Accessories" },
  { value: "Home & Living", label: "🏠 Home & Living" },
  { value: "Beauty & Personal Care", label: "💄 Beauty & Personal Care" },
  { value: "Food & Beverages", label: "🍕 Food & Beverages" },
  { value: "Sports & Outdoors", label: "⚽ Sports & Outdoors" },
  { value: "Toys & Games", label: "🎮 Toys & Games" },
  { value: "Books & Media", label: "📚 Books & Media" },
  { value: "Health & Wellness", label: "💊 Health & Wellness" },
  { value: "Automotive", label: "🚗 Automotive" },
  { value: "Pet Supplies", label: "🐾 Pet Supplies" },
  { value: "Baby Products", label: "👶 Baby Products" },
  { value: "Office Supplies", label: "📎 Office Supplies" },
  { value: "Other", label: "📦 Other" },
];

const MAX_CATEGORIES = 3;

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onProductUpdated: () => void;
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onProductUpdated,
}: EditProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { updateProduct } = useProduct();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
  });

  const selectedCategories = watch("category") || [];

  // Populate form with product data when modal opens
  useEffect(() => {
    if (product && isOpen) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);

      // Extract category names from product categories
      const categoryNames = product.category?.map((c: any) => c.category.name) || [];
      setValue("category", categoryNames);

      setValue("quantity", product.quantity);

      // Set existing images
      const imageUrls = product.images?.map((img: any) => img.url) || [];
      setExistingImages(imageUrls);
      setImagePreviews([]);
      setSelectedFiles([]);
      setImagesToRemove([]);
    }
  }, [product, isOpen, setValue]);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      // Limit to 5 total images (existing + new)
      if (existingImages.length + fileArray.length > 5) {
        showToast("You can only have up to 5 images total", "error");
        return;
      }

      setSelectedFiles((prev) => [...prev, ...fileArray]);

      // Create previews
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (indexToRemove: number) => {
    const imageToRemove = existingImages[indexToRemove];
    setImagesToRemove((prev) => [...prev, imageToRemove]);
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const removeNewImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleCategoryToggle = (categoryValue: string) => {
    const currentCategories = [...selectedCategories];

    if (currentCategories.includes(categoryValue)) {
      // Remove category
      const newCategories = currentCategories.filter(
        (c) => c !== categoryValue,
      );
      setValue("category", newCategories);
    } else {
      // Add category - check limit
      if (currentCategories.length >= MAX_CATEGORIES) {
        showToast(
          `You can only select up to ${MAX_CATEGORIES} categories`,
          "error",
        );
        return;
      }
      setValue("category", [...currentCategories, categoryValue]);
    }
  };

  const removeCategory = (categoryValue: string) => {
    const newCategories = selectedCategories.filter((c) => c !== categoryValue);
    setValue("category", newCategories);
  };

  const onSubmit = async (data: EditProductFormData) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("quantity", data.quantity.toString());
      formData.append("category", JSON.stringify(data.category));

      // Append new image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Append images to remove
      if (imagesToRemove.length > 0) {
        formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
      }

      await updateProduct.mutateAsync({ id: product.id, formData });

      showToast("Product updated successfully!", "success");
      onProductUpdated();
      onClose();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to update product",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Product
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 max-h-[70vh] overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Images Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Product Images
                </label>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Current Images:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={image}
                              alt={`Product ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">New Images:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={preview}
                              alt={`New ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {existingImages.length + imagePreviews.length < 5 && (
                  <div className="mt-2">
                    <label className="relative cursor-pointer">
                      <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors">
                        <Upload className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Add more images
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Max 5 images total (
                      {5 - (existingImages.length + imagePreviews.length)}{" "}
                      remaining)
                    </p>
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <Input
                  {...register("name")}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Categories Multi-Select Dropdown - Same as AddProductForm */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categories{" "}
                  <span className="text-xs text-gray-500">
                    (max {MAX_CATEGORIES})
                  </span>
                </label>

                {/* Selected Categories Tags */}
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCategories.map((cat) => {
                      const category = categories.find((c) => c.value === cat);
                      return (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-md border border-green-200"
                        >
                          {category?.label || cat}
                          <button
                            type="button"
                            onClick={() => removeCategory(cat)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <span
                      className={
                        selectedCategories.length > 0
                          ? "text-gray-900"
                          : "text-gray-400"
                      }
                    >
                      {selectedCategories.length === 0
                        ? "Select categories"
                        : `${selectedCategories.length} category${selectedCategories.length !== 1 ? "ies" : ""} selected`}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isCategoryOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsCategoryOpen(false)}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {categories.map((category) => {
                          const isSelected = selectedCategories.includes(
                            category.value,
                          );
                          const isDisabled =
                            !isSelected &&
                            selectedCategories.length >= MAX_CATEGORIES;

                          return (
                            <button
                              key={category.value}
                              type="button"
                              onClick={() => handleCategoryToggle(category.value)}
                              disabled={isDisabled}
                              className={`
                                w-full flex items-center justify-between px-3 py-2 text-sm transition-colors
                                ${
                                  isSelected
                                    ? "bg-green-50 text-green-600"
                                    : isDisabled
                                      ? "text-gray-400 cursor-not-allowed"
                                      : "text-gray-700 hover:bg-green-50"
                                }
                              `}
                            >
                              <span>{category.label}</span>
                              {isSelected && (
                                <Check className="h-4 w-4 text-green-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  You can select up to {MAX_CATEGORIES} categories for better
                  product discoverability
                </p>
              </div>

              {/* Price and Quantity Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₦)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white inline-flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}