"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Header from "../../components/Header";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (productsRef.current) {
        const productItems = gsap.utils.toArray<HTMLElement>('.product-item');
        if (productItems.length > 0) {
          gsap.fromTo(
            productItems,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.1,
              delay: 0.2,
              scrollTrigger: {
                trigger: productsRef.current,
                start: "top 80%",
                once: true,
              }
            }
          );
        }
      }

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => clearTimeout(refreshTimeout);
    }, productsRef);

    return () => ctx.revert();
  }, []);

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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5">
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
          >Featured Products</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {filteredProducts.map(product => (
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
          </div>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 px-4 sm:px-8 bg-foreground/5 border-t border-foreground/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-serif font-bold text-accent-primary mb-4">Elite Woodcraft</h4>
              <p className="text-foreground/70 mb-4">Creating timeless wooden masterpieces for discerning clients worldwide.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-foreground/70 hover:text-accent-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-foreground/70 hover:text-accent-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-foreground/70 hover:text-accent-primary transition-colors">
                  <span className="sr-only">Pinterest</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 20l4-9"></path>
                    <path d="M10.76 13.76c-.24 1.44.62 2.87 2.05 3.12a3.26 3.26 0 0 0 3.29-1.8 16.52 16.52 0 0 0 1.38-5.17c-.26-3.77-2.05-6.91-5.75-7.87A6.15 6.15 0 0 0 4.11 4.3c.58 2.47 1.46 4.89 2.63 7.14 1.86-3.32 6.6-5.89 9.92-3.98-2.96 2.13-3.98 6.62-1.85 9.58a6.9 6.9 0 0 0 2.89 1.05c-.88 2.29-2.75 3.85-5.02 4.57l1.33 4.34"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-3">Explore</h5>
              <ul className="space-y-2">
                <li><Link href="/portfolio" className="text-foreground/70 hover:text-accent-primary transition-colors">Portfolio</Link></li>
                <li><Link href="/services" className="text-foreground/70 hover:text-accent-primary transition-colors">Services</Link></li>
                <li><Link href="/process" className="text-foreground/70 hover:text-accent-primary transition-colors">Process</Link></li>
                <li><Link href="/shop" className="text-foreground/70 hover:text-accent-primary transition-colors">Shop</Link></li>
                <li><Link href="/blog" className="text-foreground/70 hover:text-accent-primary transition-colors">Blog</Link></li>
                <li><Link href="/about" className="text-foreground/70 hover:text-accent-primary transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-3">Services</h5>
              <ul className="space-y-2">
                <li><Link href="/services/custom-furniture" className="text-foreground/70 hover:text-accent-primary transition-colors">Custom Furniture</Link></li>
                <li><Link href="/services/decorative-carvings" className="text-foreground/70 hover:text-accent-primary transition-colors">Decorative Carvings</Link></li>
                <li><Link href="/services/architectural-elements" className="text-foreground/70 hover:text-accent-primary transition-colors">Architectural Elements</Link></li>
                <li><Link href="/services/restoration" className="text-foreground/70 hover:text-accent-primary transition-colors">Restoration</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-3">Contact</h5>
              <address className="text-foreground/70 not-italic space-y-2">
                <p>123 Timber Lane</p>
                <p>Suite 456</p>
                <p>Oakwood, CA 90210</p>
                <p><a href="tel:+15551234567" className="hover:text-accent-primary transition-colors">(555) 123-4567</a></p>
                <p><a href="mailto:info@elitewoodcraft.com" className="hover:text-accent-primary transition-colors">info@elitewoodcraft.com</a></p>
              </address>
            </div>
          </div>
          <div className="border-t border-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/50 text-sm">© {new Date().getFullYear()} Elite Woodcraft. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/privacy" className="text-foreground/50 text-sm hover:text-foreground/80 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-foreground/50 text-sm hover:text-foreground/80 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
