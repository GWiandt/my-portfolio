import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Heart, Menu, ArrowLeft, Trash2, CheckCircle } from 'lucide-react';

const allProducts = [
    { id: 1, name: "Neon Cap", price: 45.00, cat: "Men", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Urban Hoodie", price: 120.00, cat: "Women", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Cyber Sneaker", price: 250.00, cat: "Men", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Tech Pack", price: 85.00, cat: "Accessories", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Oversized Tee", price: 55.00, cat: "Women", img: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Cargo Pants", price: 95.00, cat: "Men", img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Running Vest", price: 65.00, cat: "Women", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80" },
    { id: 8, name: "Black Shades", price: 120.00, cat: "Accessories", img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80" },
];

const Ecommerce = () => {
  const [activeCat, setActiveCat] = useState("All");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [view, setView] = useState("grid"); // 'grid', 'product', 'cart', 'wishlist'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showNotification = (msg) => {
      setNotification(msg);
      setTimeout(() => setNotification(null), 2000);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    showNotification(`Added ${product.name}`);
  };

  const removeFromCart = (index) => {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
  };

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
        setWishlist(wishlist.filter(w => w !== id));
    } else {
        setWishlist([...wishlist, id]);
        showNotification("Saved to Wishlist");
    }
  };

  const openProduct = (p) => {
      setSelectedProduct(p);
      setView("product");
  };

  const visibleProducts = activeCat === "All" ? allProducts : allProducts.filter(p => p.cat === activeCat || (activeCat === "Sale" && p.price < 80));

  return (
    <div className="min-h-screen bg-white text-black pt-28 px-4 md:px-12 font-sans selection:bg-black selection:text-white pb-20">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-2xl z-50 font-bold text-sm flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400"/> {notification}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-end mb-8 md:mb-12 border-b border-gray-100 pb-8 sticky top-24 bg-white/90 backdrop-blur-md z-10 pt-4">
        <div className="cursor-pointer" onClick={() => setView("grid")}>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-1 md:mb-2">STREET / WEAR</h1>
            <p className="text-xs md:text-base text-gray-500">The 2026 Collection</p>
        </div>
        
        <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-4 md:gap-6">
                 <div className="relative cursor-pointer" onClick={() => setView("cart")}>
                    <ShoppingBag />
                    {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">{cart.length}</span>}
                 </div>
                 <div className="relative cursor-pointer" onClick={() => setView("wishlist")}>
                    <Heart className={wishlist.length > 0 ? "text-red-500 fill-red-500" : ""} />
                 </div>
                 {/* Mobile Menu Toggle */}
                 <div className="md:hidden cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                     <Menu />
                 </div>
            </div>

            {/* Desktop Filters */}
            {view === "grid" && (
                <div className="hidden md:flex gap-4 text-sm font-bold uppercase tracking-wider">
                    {["All", "Men", "Women", "Accessories", "Sale"].map(cat => (
                        <span key={cat} onClick={() => setActiveCat(cat)} className={`cursor-pointer transition-colors ${activeCat === cat ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}>
                            {cat}
                        </span>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Mobile Filters Dropdown */}
      <AnimatePresence>
          {mobileMenuOpen && view === "grid" && (
              <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="md:hidden overflow-hidden mb-8 border-b border-gray-100">
                  <div className="flex flex-col gap-3 pb-4 text-sm font-bold uppercase">
                    {["All", "Men", "Women", "Accessories", "Sale"].map(cat => (
                        <span key={cat} onClick={() => { setActiveCat(cat); setMobileMenuOpen(false); }} className={`${activeCat === cat ? 'text-black' : 'text-gray-400'}`}>{cat}</span>
                    ))}
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* --- GRID VIEW --- */}
      {view === "grid" && (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             <AnimatePresence mode='popLayout'>
                 {visibleProducts.map((p) => (
                    <motion.div layout key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => openProduct(p)} className="group cursor-pointer">
                       <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4] mb-4">
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
                             <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="flex-1 bg-white text-black font-bold py-3 rounded-lg shadow-xl hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                                <ShoppingBag size={16} /> Add
                             </button>
                             <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }} className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-xl hover:text-red-500 transition-colors">
                                <Heart size={20} fill={wishlist.includes(p.id) ? "currentColor" : "none"} />
                             </button>
                          </div>
                          {p.price < 80 && <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold uppercase">Sale</div>}
                       </div>
                       <div className="flex justify-between items-start">
                          <div><p className="text-xs text-gray-500 font-bold uppercase">{p.cat}</p><h3 className="text-lg font-bold">{p.name}</h3></div>
                          <span className="font-medium">${p.price}</span>
                       </div>
                    </motion.div>
                 ))}
             </AnimatePresence>
         </div>
      )}

      {/* --- PRODUCT DETAIL VIEW --- */}
      {view === "product" && selectedProduct && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
              <button onClick={() => setView("grid")} className="flex items-center gap-2 text-sm font-bold mb-8 hover:text-gray-600"><ArrowLeft size={16}/> Back to Shop</button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
                      <img src={selectedProduct.img} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">{selectedProduct.cat}</div>
                      <h1 className="text-5xl font-black mb-4">{selectedProduct.name}</h1>
                      <div className="text-3xl font-medium mb-8">${selectedProduct.price}</div>
                      <p className="text-gray-600 mb-8 leading-relaxed">
                          Engineered for the modern urban environment. Featuring breathable technical fabrics and 
                          reinforced stitching for maximum durability. Designed in Tokyo, built for the world.
                      </p>
                      <div className="flex gap-4 mb-8">
                          {["S", "M", "L", "XL"].map(s => (
                              <button key={s} className="w-12 h-12 border border-gray-200 rounded-lg hover:border-black hover:bg-black hover:text-white transition-all font-bold">{s}</button>
                          ))}
                      </div>
                      <button onClick={() => addToCart(selectedProduct)} className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                          <ShoppingBag /> Add to Cart
                      </button>
                  </div>
              </div>
          </motion.div>
      )}

      {/* --- CART VIEW --- */}
      {view === "cart" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
              <button onClick={() => setView("grid")} className="flex items-center gap-2 text-sm font-bold mb-8 hover:text-gray-600"><ArrowLeft size={16}/> Continue Shopping</button>
              <h2 className="text-4xl font-black mb-8">Your Cart ({cart.length})</h2>
              {cart.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">Your cart is empty.</div>
              ) : (
                  <div className="space-y-4">
                      {cart.map((item, i) => (
                          <div key={i} className="flex gap-4 items-center p-4 border border-gray-100 rounded-xl">
                              <img src={item.img} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                              <div className="flex-1">
                                  <h3 className="font-bold">{item.name}</h3>
                                  <p className="text-gray-500">${item.price}</p>
                              </div>
                              <button onClick={() => removeFromCart(i)} className="p-2 hover:bg-gray-100 rounded-full text-red-500"><Trash2 size={20}/></button>
                          </div>
                      ))}
                      <div className="border-t border-gray-100 pt-8 mt-8 flex justify-between items-center">
                          <div className="text-xl font-bold">Total: ${cart.reduce((a, b) => a + b.price, 0)}</div>
                          <button className="px-8 py-3 bg-black text-white rounded-xl font-bold">Checkout</button>
                      </div>
                  </div>
              )}
          </motion.div>
      )}

      {/* --- WISHLIST VIEW --- */}
      {view === "wishlist" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
             <button onClick={() => setView("grid")} className="flex items-center gap-2 text-sm font-bold mb-8 hover:text-gray-600"><ArrowLeft size={16}/> Back to Shop</button>
             <h2 className="text-4xl font-black mb-8">Your Wishlist</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {allProducts.filter(p => wishlist.includes(p.id)).map(p => (
                     <div key={p.id} onClick={() => openProduct(p)} className="cursor-pointer">
                         <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-4 overflow-hidden"><img src={p.img} className="w-full h-full object-cover"/></div>
                         <h3 className="font-bold">{p.name}</h3>
                         <p>${p.price}</p>
                     </div>
                 ))}
                 {wishlist.length === 0 && <p className="text-gray-400 col-span-4 text-center">No items saved yet.</p>}
             </div>
          </motion.div>
      )}
    </div>
  );
};

export default Ecommerce;