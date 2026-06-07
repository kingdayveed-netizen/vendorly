export type UserRole = 'VENDOR' | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  storeName?: string;
  phone?: string;
  vendor?: {
    storeSlug: string;
    storeName: string;
  },
  profileImage?: string;
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

