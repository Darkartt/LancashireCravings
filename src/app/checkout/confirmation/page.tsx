"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Mail, Home, ArrowRight } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || "ORD-" + Date.now();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase from Lancashire Cravings
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Your order has been successfully placed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="text-2xl font-bold font-mono">{orderId}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="font-medium">{new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                <p className="font-medium">5-7 business days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Order Confirmation Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email with your order details to your email address.
                    Please check your spam folder if you don't see it.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Order Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Our craftsmen will carefully prepare your order. You'll receive a shipping
                    notification with tracking details once your order is dispatched.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Your handcrafted pieces will be delivered within 5-7 business days. Each item
                    is carefully packaged to ensure it arrives in perfect condition.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Alert */}
        <Alert className="mb-6">
          <Mail className="h-4 w-4" />
          <AlertDescription>
            Have questions about your order? Contact us at{" "}
            <a href="mailto:orders@lancashirecarvings.com" className="font-medium underline">
              orders@lancashirecarvings.com
            </a>{" "}
            or call us at{" "}
            <a href="tel:+441234567890" className="font-medium underline">
              +44 1234 567890
            </a>
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="flex-1">
            <Link href="/">
              <Home className="mr-2 w-4 h-4" />
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1">
            <Link href="/shop">
              Continue Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Order number: <span className="font-mono font-medium">{orderId}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Keep this number for your records
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading confirmation...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
