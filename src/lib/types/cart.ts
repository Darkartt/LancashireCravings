export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  woodType?: string;
  finish?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: "cm" | "inches";
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface BillingAddress extends ShippingAddress {
  sameAsShipping: boolean;
}

export interface OrderData {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: "card" | "paypal" | "bank_transfer";
  total: number;
  orderNotes?: string;
}
