import { z } from "zod";

// Shipping Address Schema
export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  addressLine1: z.string().min(5, "Address is required").max(200, "Address too long"),
  addressLine2: z.string().max(200, "Address too long").optional(),
  city: z.string().min(2, "City is required").max(100, "City name too long"),
  state: z.string().min(2, "State/County is required").max(100, "State name too long"),
  postalCode: z.string().min(3, "Postal code is required").max(20, "Postal code too long"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number too long"),
});

// Billing Address Schema
export const billingAddressSchema = z.object({
  sameAsShipping: z.boolean(),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long").optional(),
  addressLine1: z.string().min(5, "Address is required").max(200, "Address too long").optional(),
  addressLine2: z.string().max(200, "Address too long").optional(),
  city: z.string().min(2, "City is required").max(100, "City name too long").optional(),
  state: z.string().min(2, "State/County is required").max(100, "State name too long").optional(),
  postalCode: z.string().min(3, "Postal code is required").max(20, "Postal code too long").optional(),
  country: z.string().min(2, "Country is required").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20, "Phone number too long").optional(),
});

// Payment Information Schema
export const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "paypal", "bank_transfer"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVV: z.string().optional(),
  cardName: z.string().optional(),
});

// Order Notes Schema
export const orderNotesSchema = z.object({
  orderNotes: z.string().max(500, "Notes too long (max 500 characters)").optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  subscribeNewsletter: z.boolean().optional(),
});

// Complete Checkout Schema
export const checkoutSchema = z.object({
  ...shippingAddressSchema.shape,
  billing: billingAddressSchema,
  payment: paymentSchema,
  orderNotes: z.string().max(500, "Notes too long").optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  subscribeNewsletter: z.boolean().optional(),
});

export type ShippingAddressData = z.infer<typeof shippingAddressSchema>;
export type BillingAddressData = z.infer<typeof billingAddressSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type OrderNotesData = z.infer<typeof orderNotesSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;
