"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Product, CreateProductDto, UpdateProductDto } from "@/types/product";
import { setProducts } from "@/redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { toast } from "sonner";

export const useProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const { products, selectedProduct } = useSelector(
    (state: RootState) => state.products,
  );

  const vendorProducts = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get<Product[]>(
        "/products/vendor/my-products",
      );
      dispatch(setProducts(response.data));
      return response.data;
    },
  });

  const vendorProduct = (productId: string) => {
    return useQuery({
      queryKey: ["product", productId],
      queryFn: async () => {
        const response = await axiosInstance.get<Product>(
          `/products/${productId}`,
        );
        return response.data;
      },
      enabled: !!productId, // Only run if productId exists
    });
  };

  const useSingleProduct = (productId: string) => {
    return useQuery({
      queryKey: ["product", productId],
      queryFn: async () => {
        const response = await axiosInstance.get<Product>(
          `/products/${productId}`,
        );
        return response.data;
      },
      enabled: !!productId,
    });
  };

  const createProduct = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post<Product>(
        "/products/create-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      dispatch(setProducts([response.data]));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await axiosInstance.put<Product>(
        `/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      const res = await axiosInstance.delete(`/products/${productId}`);
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success(data.message, { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  return {
    products,
    selectedProduct,
    vendorProducts,
    vendorProduct,
    useSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
