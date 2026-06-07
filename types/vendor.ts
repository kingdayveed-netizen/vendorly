import { User } from './user';
import { Product } from './product';

export interface Vendor extends User {
  role: 'VENDOR';
  storeName: string;
  phoneNumber: string;
  products?: Product[];
}

export interface Storefront {
  vendor: Vendor;
  products: Product[];
}

