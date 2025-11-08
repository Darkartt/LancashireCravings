"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { checkoutSchema, type CheckoutData } from "@/lib/validations/checkout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ShoppingBag, CreditCard, Truck, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United Kingdom",
      phone: "",
      billing: {
        sameAsShipping: true,
      },
      payment: {
        paymentMethod: "card",
      },
      orderNotes: "",
      agreeToTerms: false,
      subscribeNewsletter: false,
    },
  });

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <CardTitle>Your Cart is Empty</CardTitle>
            <CardDescription>Add some items to your cart before checking out</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/shop">Browse Shop</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);
  };

  const onSubmit = async (data: CheckoutData) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, this would call your payment gateway API
      console.log("Order data:", {
        ...data,
        items: cart.items,
        total: cart.total,
      });

      // Clear cart and redirect
      clearCart();
      toast.success("Order placed successfully!");
      router.push("/checkout/confirmation?order=" + Date.now());
    } catch (error) {
      toast.error("Failed to process order. Please try again.");
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/shop">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Shop
            </Link>
          </Button>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Shipping Address
                    </CardTitle>
                    <CardDescription>Where should we deliver your order?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John Smith" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1 *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="123 Main Street" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Apt, suite, unit, etc. (optional)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="London" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>County *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Greater London" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="SW1A 1AA" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="+44 7700 900000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Payment Method
                    </CardTitle>
                    <CardDescription>Select your preferred payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="payment.paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="card" />
                                </FormControl>
                                <FormLabel className="flex-1 cursor-pointer font-normal">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">Credit / Debit Card</p>
                                      <p className="text-sm text-muted-foreground">
                                        Pay securely with Stripe
                                      </p>
                                    </div>
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                </FormLabel>
                              </FormItem>

                              <FormItem className="flex items-center space-x-3 space-y-0 border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="paypal" />
                                </FormControl>
                                <FormLabel className="flex-1 cursor-pointer font-normal">
                                  <div>
                                    <p className="font-medium">PayPal</p>
                                    <p className="text-sm text-muted-foreground">
                                      Redirect to PayPal
                                    </p>
                                  </div>
                                </FormLabel>
                              </FormItem>

                              <FormItem className="flex items-center space-x-3 space-y-0 border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="bank_transfer" />
                                </FormControl>
                                <FormLabel className="flex-1 cursor-pointer font-normal">
                                  <div>
                                    <p className="font-medium">Bank Transfer</p>
                                    <p className="text-sm text-muted-foreground">
                                      Manual bank transfer (instructions will be provided)
                                    </p>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("payment.paymentMethod") === "card" && (
                      <Alert className="mt-4">
                        <Lock className="w-4 h-4" />
                        <AlertDescription>
                          Card payment processing will be handled securely by Stripe. No card details
                          are stored on our servers.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Order Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                    <CardDescription>Optional notes about your order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="orderNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Special delivery instructions, gift message, etc."
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormDescription>Max 500 characters</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              I agree to the terms and conditions *
                            </FormLabel>
                            <FormDescription>
                              By placing this order, you agree to our{" "}
                              <Link href="/terms" className="text-primary underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="/privacy" className="text-primary underline">
                                Privacy Policy
                              </Link>
                              .
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subscribeNewsletter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              Subscribe to our newsletter
                            </FormLabel>
                            <FormDescription>
                              Receive updates about new products and exclusive offers
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>{cart.items.length} items</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {cart.shipping === 0 ? (
                          <Badge variant="default" className="text-xs">FREE</Badge>
                        ) : (
                          formatPrice(cart.shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (VAT 20%)</span>
                      <span>{formatPrice(cart.tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 w-5 h-5" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Secure checkout powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
