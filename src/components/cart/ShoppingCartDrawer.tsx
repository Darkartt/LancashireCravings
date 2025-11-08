"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export function ShoppingCartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({cart.items.length})
          </SheetTitle>
          <SheetDescription>
            {cart.items.length === 0
              ? "Your cart is empty"
              : `${cart.items.length} item${cart.items.length > 1 ? "s" : ""} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add some beautiful handcrafted pieces to get started
            </p>
            <Button onClick={() => setIsCartOpen(false)} asChild>
              <Link href="/shop">Browse Shop</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 line-clamp-1">{item.name}</h4>
                      {item.woodType && (
                        <Badge variant="secondary" className="text-xs mb-2">
                          {item.woodType}
                        </Badge>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="px-2 text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {cart.shipping === 0 ? (
                      <Badge variant="default" className="text-xs">
                        FREE
                      </Badge>
                    ) : (
                      formatPrice(cart.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (VAT 20%)</span>
                  <span className="font-medium">{formatPrice(cart.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">{formatPrice(cart.total)}</span>
                </div>
              </div>

              {/* Free Shipping Message */}
              {cart.subtotal < 200 && cart.subtotal > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <p className="text-xs text-center">
                    Add <strong>{formatPrice(200 - cart.subtotal)}</strong> more for{" "}
                    <strong>FREE shipping</strong>! 🎉
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <SheetFooter className="flex-col sm:flex-col gap-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsCartOpen(false)}
                  asChild
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
