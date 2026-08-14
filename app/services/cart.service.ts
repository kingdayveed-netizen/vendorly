import axiosInstance from "@/lib/axios";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  quantity: number;
  images: { url: string }[];
}

export interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { data } = await axiosInstance.get('/cart');
    return data;
  },

  addToCart: async (dto: AddToCartDto): Promise<CartItem> => {
    const { data } = await axiosInstance.post('/cart/add', dto);
    return data;
  },

  removeCartItem: async (itemId: string): Promise<Cart> => {
    const { data } = await axiosInstance.delete(`/cart/items/${itemId}`);
    return data;
  },
};
