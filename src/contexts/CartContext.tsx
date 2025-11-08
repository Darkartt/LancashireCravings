"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Cart } from "@/lib/types/cart";

interface CartContextType {
  cart: Cart;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.2; // 20% VAT (UK)
const SHIPPING_FLAT_RATE = 15; // £15 flat rate
const FREE_SHIPPING_THRESHOLD = 200; // Free shipping over £200

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("lancashire-cravings-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lancashire-cravings-cart", JSON.stringify(items));
  }, [items]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const cart: Cart = {
    items,
    subtotal,
    tax,
    shipping,
    total,
  };

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prevItems) => {
      // Check if item already exists
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id);

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
    setIsCartOpen(true); // Open cart drawer when item is added
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
