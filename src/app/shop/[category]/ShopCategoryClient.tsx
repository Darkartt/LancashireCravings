"use client";

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

export default function ShopCategoryClient() {
  const params = useParams();
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
          >Our Collection</motion.h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                className="bg-background rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative h-64">
                  <Image 
                    src={product.images[0]} 
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full flex justify-between items-center">
                      <button 
                        onClick={() => handleQuickView(product)} 
                        className="text-white bg-black/50 hover:bg-black/70 px-3 py-1 rounded text-sm"
                      >
                        Quick View
                      </button>
                      <button 
                        onClick={() => handleAddToCart(product)} 
                        className="text-white bg-accent-primary hover:bg-accent-primary/80 px-3 py-1 rounded text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-medium text-accent-primary">{product.name}</h4>
                  <p className="text-sm text-foreground/70 mt-1">{product.wood} wood</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">£{product.price.toFixed(2)}</span>
                    <span className="text-xs text-foreground/60 capitalize">{product.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 relative h-96 lg:h-auto">
                <Image 
                  src={quickViewProduct.images[0]} 
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                />
              </div>
              <div className="p-6 lg:w-1/2">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-serif font-medium text-accent-primary">{quickViewProduct.name}</h3>
                  <button 
                    onClick={handleCloseQuickView}
                    className="text-foreground/60 hover:text-foreground"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-lg font-medium mt-4">£{quickViewProduct.price.toFixed(2)}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-sm text-foreground/70 capitalize mr-2">{quickViewProduct.wood} wood</span>
                  <span className="bg-foreground/10 text-xs px-2 py-1 rounded capitalize">{quickViewProduct.category}</span>
                </div>
                <p className="mt-4 text-foreground/80">{quickViewProduct.description}</p>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Wood Type</h4>
                    <div className="flex space-x-2">
                      <button className={`w-8 h-8 rounded-full ${quickViewProduct.wood === 'walnut' ? 'ring-2 ring-accent-primary' : ''}`} style={{ backgroundColor: '#5D4037' }}></button>
                      <button className={`w-8 h-8 rounded-full ${quickViewProduct.wood === 'oak' ? 'ring-2 ring-accent-primary' : ''}`} style={{ backgroundColor: '#A1887F' }}></button>
                      <button className={`w-8 h-8 rounded-full ${quickViewProduct.wood === 'cherry' ? 'ring-2 ring-accent-primary' : ''}`} style={{ backgroundColor: '#8D6E63' }}></button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Quantity</h4>
                    <div className="flex items-center w-32 border border-foreground/20 rounded">
                      <button className="px-3 py-1 text-foreground/60">-</button>
                      <input type="number" className="w-full text-center bg-transparent" value="1" readOnly />
                      <button className="px-3 py-1 text-foreground/60">+</button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 space-x-4">
                  <button 
                    onClick={() => handleAddToCart(quickViewProduct)} 
                    className="bg-accent-primary hover:bg-accent-primary/90 text-white px-6 py-2 rounded transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                  <button className="border border-foreground/20 hover:border-foreground/40 px-6 py-2 rounded transition-colors duration-300">
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-background shadow-lg transform transition-transform duration-300 z-40 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-foreground/10 flex justify-between items-center">
          <h3 className="font-medium">Shopping Cart ({cartItems.length})</h3>
          <button onClick={handleCartToggle} className="text-foreground/60 hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-180px)] p-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-foreground/60 mt-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-3 border-b border-foreground/10 pb-3">
                  <div className="w-20 h-20 relative">
                    <Image 
                      src={item.images[0]} 
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-foreground/70">{item.wood} wood</p>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm">£{item.price.toFixed(2)}</p>
                      <button className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-foreground/10 bg-background">
            <div className="flex justify-between mb-4">
              <span>Subtotal:</span>
              <span className="font-medium">£{cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</span>
            </div>
            <button className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white py-2 rounded transition-colors duration-300">
              Checkout
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
