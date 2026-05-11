export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: {
    url: string;
  }[];
  vendorId: string;
  category: {
    productId: string;
    categoryId: string;
    category: {
      name: string;
    };
  }[];
  tags: string[];
  vendor?: {
    id: string;
    storeName: string;
    fullName: string;
    storeSlug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
}
