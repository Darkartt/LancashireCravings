"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";
import ProductGalleryBackground from "../../../components/backgrounds/ProductGalleryBackground";
import Footer from "../../../components/Footer";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  wood: string;
  images: string[];
}

export default function ShopCategory() {  const params = useParams();
  const category = params.category as string;
  const productsRef = useRef<HTMLDivElement>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const products = [
    { id: 1, name: "Hand-Carved Wooden Bowl", description: "A beautifully crafted walnut bowl, perfect as a centerpiece or functional decor.", price: 329.00, category: "decorative", wood: "walnut", images: ["/walnut_grain.jpeg"] },
    { id: 2, name: "Oak Serving Tray", description: "A sleek oak tray with intricate edge detailing, ideal for entertaining or display.", price: 289.00, category: "kitchenware", wood: "oak", images: ["/oak_grain.jpeg"] },
    { id: 3, name: "Cherry Wood Coasters (Set of 4)", description: "A set of four cherry wood coasters with natural grain patterns, protecting surfaces in style.", price: 145.00, category: "accessories", wood: "cherry", images: ["/cherry_grain.jpeg"] },
    { id: 4, name: "Wall-Mounted Wooden Shelf", description: "A compact walnut shelf with subtle carvings, perfect for displaying small decor items.", price: 279.00, category: "furniture", wood: "walnut", images: ["/walnut_grain.jpeg"] },
    { id: 5, name: "Carved Wooden Sculpture", description: "An abstract oak sculpture that adds a touch of artistry to any space.", price: 499.00, category: "sculptures", wood: "oak", images: ["/oak_grain.jpeg"] },
    { id: 6, name: "Wooden Jewelry Box", description: "A cherry wood box with intricate lid carvings, lined with velvet for storing treasures.", price: 309.00, category: "gifts", wood: "cherry", images: ["/cherry_grain.jpeg"] },
    { id: 7, name: "Custom Memorial Plaque", description: "A personalized memorial plaque crafted from premium wood, perfect for honoring loved ones.", price: 349.00, category: "memorial", wood: "walnut", images: ["/walnut_grain.jpeg"] },
    { id: 8, name: "Decorative Wall Art", description: "Hand-carved wall art piece that brings warmth and character to any room.", price: 299.00, category: "decorative", wood: "oak", images: ["/oak_grain.jpeg"] }
  ];

  const filteredProducts = category === "all" ? products : products.filter(product => product.category === category);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground" style={{ zIndex: 20 }}>
      <ProductGalleryBackground />
      <Header />      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-transparent pt-24"> {/* Added top padding for header */}
        <div className="container mx-auto relative" style={{ zIndex: 10 }}>
          <motion.h2
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Shop {categoryTitle}</motion.h2>
          <motion.p 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >Explore our handcrafted wooden pieces in the {categoryTitle.toLowerCase()} category, crafted with the same dedication as our bespoke commissions.</motion.p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-8 bg-foreground/5" ref={productsRef}>
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >{categoryTitle} Products</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product.id} className="product-item bg-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-64 bg-foreground/10 relative">
                    <Image src={product.images[0]} alt={product.name} width={400} height={400} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleQuickView(product)}
                      className="absolute bottom-0 left-0 right-0 bg-accent-primary/80 text-background px-4 py-2 text-sm font-medium hover:bg-accent-primary/90 transition-colors"
                    >
                      Quick View
                    </button>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-serif font-semibold text-foreground mb-2">{product.name}</h4>
                    <p className="text-foreground/80 mb-2">{product.description}</p>
                    <p className="text-accent-primary font-bold mb-2">${product.price.toFixed(2)}</p>
                    <div className="flex items-center mb-4">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="text-foreground/70 text-sm ml-2">(12 reviews)</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-accent-primary text-background px-4 py-2 rounded-md font-medium hover:bg-accent-primary/90 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-foreground/70 col-span-full">No products found in this category.</p>
            )}
          </div>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/shop" className="inline-block border-2 border-accent-primary text-accent-primary px-8 py-3 rounded-md font-medium hover:bg-accent-primary/10 transition-colors">Back to All Products</Link>
          </motion.div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-96 bg-foreground/10">
                <Image src={quickViewProduct.images[0]} alt={quickViewProduct.name} width={400} height={400} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">{quickViewProduct.name}</h3>
                <p className="text-accent-primary font-bold mb-2">${quickViewProduct.price.toFixed(2)}</p>
                <p className="text-foreground/80 mb-4">{quickViewProduct.description}</p>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-foreground/70 text-sm ml-2">(12 reviews)</span>
                </div>
                <button 
                  onClick={() => handleAddToCart(quickViewProduct)}
                  className="w-full bg-accent-primary text-background px-4 py-2 rounded-md font-medium hover:bg-accent-primary/90 transition-colors mb-4"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleCloseQuickView}
                  className="w-full border border-accent-primary text-accent-primary px-4 py-2 rounded-md font-medium hover:bg-accent-primary/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-background w-80 h-full shadow-xl p-6 overflow-auto">
            <h3 className="text-xl font-serif font-bold text-accent-primary mb-4">Your Cart</h3>
            {cartItems.length === 0 ? (
              <p className="text-foreground/70">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center border-b border-foreground/10 pb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-foreground/70 text-sm">${item.price.toFixed(2)}</p>
                    </div>
                    <button className="text-foreground/70 hover:text-accent-primary">Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-foreground/10 pt-4">
              <p className="text-foreground font-bold mb-4">Total: ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
              <Link href="/checkout" className="block w-full bg-accent-primary text-background px-4 py-2 rounded-md font-medium hover:bg-accent-primary/90 transition-colors text-center mb-2">Checkout</Link>
              <button 
                onClick={handleCartToggle}
                className="w-full border border-accent-primary text-accent-primary px-4 py-2 rounded-md font-medium hover:bg-accent-primary/10 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>      )}

      <Footer />
    </div>
  );
}
