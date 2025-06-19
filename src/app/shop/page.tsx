"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Header from "../../components/Header";
import ShopBackground from "../../components/backgrounds/ShopBackground";
import Footer from "../../components/Footer";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  wood: string;
  images: string[];
}

export default function Shop() {
  const productsRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [woodType, setWoodType] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isInView = useInView(productsRef, { once: true, amount: 0.3 });
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
    { id: 1, name: "Hand-Carved Wooden Bowl", description: "A beautifully crafted walnut bowl, perfect as a centerpiece or functional decor.", price: 129.00, category: "decorative", wood: "walnut", images: ["/placeholder.jpg"] },
    { id: 2, name: "Oak Serving Tray", description: "A sleek oak tray with intricate edge detailing, ideal for entertaining or display.", price: 89.00, category: "kitchenware", wood: "oak", images: ["/placeholder.jpg"] },
    { id: 3, name: "Cherry Wood Coasters (Set of 4)", description: "A set of four cherry wood coasters with natural grain patterns, protecting surfaces in style.", price: 45.00, category: "accessories", wood: "cherry", images: ["/placeholder.jpg"] },
    { id: 4, name: "Wall-Mounted Wooden Shelf", description: "A compact walnut shelf with subtle carvings, perfect for displaying small decor items.", price: 79.00, category: "furniture", wood: "walnut", images: ["/placeholder.jpg"] },
    { id: 5, name: "Carved Wooden Sculpture", description: "An abstract oak sculpture that adds a touch of artistry to any space.", price: 199.00, category: "sculptures", wood: "oak", images: ["/placeholder.jpg"] },
    { id: 6, name: "Wooden Jewelry Box", description: "A cherry wood box with intricate lid carvings, lined with velvet for storing treasures.", price: 109.00, category: "gifts", wood: "cherry", images: ["/placeholder.jpg"] },
    { id: 7, name: "Custom Memorial Plaque", description: "A personalized memorial plaque crafted from premium wood, perfect for honoring loved ones.", price: 149.00, category: "memorial", wood: "walnut", images: ["/placeholder.jpg"] },
    { id: 8, name: "Decorative Wall Art", description: "Hand-carved wall art piece that brings warmth and character to any room.", price: 99.00, category: "decorative", wood: "oak", images: ["/placeholder.jpg"] }
  ];

  const filteredProducts = products.filter(product => 
    (selectedCategory === "all" || product.category === selectedCategory) &&
    (priceRange === "all" || 
      (priceRange === "0-50" && product.price <= 50) ||
      (priceRange === "51-100" && product.price > 50 && product.price <= 100) ||
      (priceRange === "101+" && product.price > 100)) &&
    (woodType === "all" || product.wood === woodType)
  );

  return (
    <div className="flex flex-col min-h-screen text-foreground relative overflow-hidden" style={{ background: 'transparent' }}>
      {/* Full Page Background */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -1, pointerEvents: 'none', width: '100%', height: '100vh' }}>
        <ShopBackground />
      </div>
      <Header />      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5 pt-24"> {/* Added top padding for header */}
        <div className="container mx-auto relative" style={{ zIndex: 10 }}>
          <motion.h2 
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Shop Elite Woodcraft</motion.h2>
          <motion.p 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >Browse our collection of handcrafted wooden pieces, from elegant decor to functional art, all crafted with the same dedication as our bespoke commissions.</motion.p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-8 bg-background">
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Shop by Category</motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link href="/shop/decorative" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Decorative Pieces</h4>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/shop/furniture" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Small Furniture</h4>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/shop/accessories" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Wooden Accessories</h4>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filtering and Sorting Section */}
      <section className="py-8 px-4 sm:px-8 bg-foreground/5">
        <div className="container mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground/80 mb-2">Category</label>
              <select 
                id="category" 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 bg-background border border-foreground/20 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="decorative">Decorative Pieces</option>
                <option value="furniture">Furniture</option>
                <option value="kitchenware">Kitchenware</option>
                <option value="accessories">Accessories</option>
                <option value="sculptures">Sculptures</option>
                <option value="gifts">Personalized Gifts</option>
                <option value="memorial">Memorial Pieces</option>
              </select>
            </div>
            <div>
              <label htmlFor="priceRange" className="block text-sm font-medium text-foreground/80 mb-2">Price Range</label>
              <select 
                id="priceRange" 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
                className="block w-full px-3 py-2 bg-background border border-foreground/20 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm"
              >
                <option value="all">All Prices</option>
                <option value="0-50">$0 - $50</option>
                <option value="51-100">$51 - $100</option>
                <option value="101+">$101+</option>
              </select>
            </div>
            <div>
              <label htmlFor="woodType" className="block text-sm font-medium text-foreground/80 mb-2">Wood Type</label>
              <select 
                id="woodType" 
                value={woodType} 
                onChange={(e) => setWoodType(e.target.value)}
                className="block w-full px-3 py-2 bg-background border border-foreground/20 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm"
              >
                <option value="all">All Woods</option>
                <option value="walnut">Walnut</option>
                <option value="oak">Oak</option>
                <option value="cherry">Cherry</option>
              </select>
            </div>
          </motion.div>
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
          >Featured Products</motion.h3>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
                className="product-item bg-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                initial={{ y: 30, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  delay: index * 0.1
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
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
                  >                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/shop/all" className="inline-block border-2 border-accent-primary text-accent-primary px-8 py-3 rounded-md font-medium hover:bg-accent-primary/10 transition-colors">View All Products</Link>
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
        </div>
      )}

      {/* Call to Action Section with Custom Order Form */}
      <section className="py-16 px-4 sm:px-8 bg-accent-primary/10">
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Looking for Something Unique?</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Can't find the perfect piece? Commission a custom creation tailored to your vision.</p>
          <div className="max-w-xl mx-auto bg-background p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-serif font-semibold text-accent-primary mb-4">Request a Custom Piece</h4>
            <form className="space-y-4">
              <div>
                <label htmlFor="customName" className="block text-sm font-medium text-foreground/80">Name</label>
                <input type="text" name="customName" id="customName" className="mt-1 block w-full px-3 py-2 bg-background border border-foreground/20 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="customEmail" className="block text-sm font-medium text-foreground/80">Email</label>
                <input type="email" name="customEmail" id="customEmail" className="mt-1 block w-full px-3 py-2 bg-background border border-foreground/20 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm" />
              </div>
              <div>
                <label htmlFor="customDescription" className="block text-sm font-medium text-foreground/80">Description of Custom Piece</label>
                <textarea id="customDescription" name="customDescription" rows={3} className="mt-1 block w-full px-3 py-2 bg-background border border-foreground/20 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm" placeholder="Describe your desired piece, including dimensions, wood preferences, and any specific design elements..."></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
