import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Heart, ShoppingCart, HelpCircle, Sun, Moon, Menu, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useThemeStore } from '@/stores/useThemeStore';
import { useCartStore } from '@/stores/useCartStore';
import { useFetchProducts } from '@/features/products';
import { paths } from '@/config/paths';
import logo from '@/assets/icons/final_logo.png';
import { HeaderMegaMenu } from './HeaderMegaMenu';

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useThemeStore();
    const { items: cartItems, removeItem, updateQuantity } = useCartStore();
    
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // States
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const { data: searchResults } = useFetchProducts({ search: searchQuery });
    const displaySearchMatches = searchQuery ? (searchResults || []).slice(0, 4) : [];

    const searchContainerRef = useRef<HTMLDivElement>(null);
      
    // Close search popup if clicked outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setIsSearchFocused(false);
        }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Close drawers on path change
    useEffect(() => {
        setIsCartOpen(false);
        setIsMobileMenuOpen(false);
        setIsSearchFocused(false);
        setSearchQuery('');
    }, [location.pathname]);
    
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`${paths.customer.search}?q=${encodeURIComponent(searchQuery)}`);
        setIsSearchFocused(false);
    };
  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-unilo-border dark:border-gray-800 dark:bg-gray-950/90 bg-gradient-to-b from-black/40 via-black/10 to-transparent pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto flex flex-wrap items-center justify-between pt-2 lg:h-20 lg:pt-0 lg:flex-nowrap">

            {/* Logo */}
            <Link to="/" className="flex flex-col shrink-0 decoration-none group order-1">
              <img src={logo} alt="UNILO Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            </Link>

          {/* Desktop Search bar with dropdown matching */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 order-2 lg:order-3">
      
            {/* Thanh tìm kiếm bo tròn (Pill-shape) giống Uniqlo */}
            <div ref={searchContainerRef} className="relative hidden md:block w-48 md:w-64 lg:w-[320px] mr-1 sm:mr-2">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-white/95 hover:bg-white transition-colors rounded-full px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm">
                <Search className="text-gray-500 w-4 h-4 mr-2 sm:mr-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Bạn đang tìm sản phẩm gì?"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-xs sm:text-sm text-gray-800 placeholder-gray-500 font-medium"
                />
              </form>

              {/* Predictive suggestions popup (Giữ nguyên logic của bạn, chỉ tinh chỉnh bo góc) */}
              {isSearchFocused && (
                <div className="absolute top-full right-0 left-0 mt-3 bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden p-4 space-y-3 animate-fade-in text-xs pointer-events-auto text-left">
                  {searchQuery ? (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Products matches</div>
                      {displaySearchMatches.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            navigate(paths.customer.productDetail.replace(':id', product.id));
                            setIsSearchFocused(false);
                          }}
                          className="flex gap-3 items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors"
                        >
                          <img src={product.variants[0]?.images[0]} alt="" className="w-10 h-12 object-cover rounded-md shadow-sm" />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold truncate text-gray-900 dark:text-white">{product.name}</div>
                            <div className="text-gray-500 font-semibold">${(product.price / 23000).toFixed(0)}</div>
                          </div>
                        </div>
                      ))}
                      {displaySearchMatches.length === 0 && (
                        <div className="text-gray-400 py-3 text-center">No matching products found.</div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Popular Searches</div>
                      {['Supima Cotton', 'Fine Merino Sweater', 'Chino Pants', 'Linen Shirt'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="w-full text-left py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-accent font-semibold transition-colors cursor-pointer text-gray-700 dark:text-gray-300 border-none bg-transparent"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 text-center mt-2">
                    <Link
                      to={paths.customer.search}
                      className="text-[10px] uppercase tracking-wider text-accent font-bold hover:underline"
                      onClick={() => setIsSearchFocused(false)}
                    >
                      Open Advanced Search
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Các Icons (Đổi sang màu trắng để nổi bật trên nền đen mờ) */}
            <button onClick={toggleTheme} className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-white transition-colors border-none bg-transparent cursor-pointer">
              {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
            </button>

            <Link to={paths.customer.wishlist} className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-white transition-colors hidden sm:flex items-center justify-center">
              <Heart size={20} strokeWidth={1.5} />
            </Link>

            <Link to={paths.customer.account} className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-white transition-colors hidden sm:flex items-center justify-center">
              <User size={20} strokeWidth={1.5} />
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-white transition-colors relative border-none bg-transparent cursor-pointer flex items-center justify-center">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-[9px] sm:text-[10px] font-black w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center border-2 border-transparent">
                  {totalQuantity}
                </span>
              )}
            </button>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-1.5 rounded-full hover:bg-white/10 text-white border-none bg-transparent cursor-pointer flex items-center justify-center">
              <Menu size={22} strokeWidth={1.5} />
            </button>
            
          </div>

          <div className="w-full lg:w-auto order-3 lg:order-2 mt-2 lg:mt-0 flex-1 lg:px-8 overflow-x-auto scrollbar-hide">
          <HeaderMegaMenu />
        </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-fade-in lg:hidden">
          <div className="w-64 h-full bg-white dark:bg-gray-900 p-6 space-y-6 flex flex-col justify-between animate-slide-up text-xs font-bold uppercase tracking-wider">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-unilo-border dark:border-gray-800 pb-4">
                <span className="font-heading font-black text-sm text-primary dark:text-white">UNILO Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-unilo-muted rounded-full border-none bg-transparent cursor-pointer">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                <Link to={paths.customer.men} className="hover:text-accent decoration-none">Men</Link>
                <Link to={paths.customer.women} className="hover:text-accent decoration-none">Women</Link>
                <Link to={paths.customer.newArrivals} className="hover:text-accent decoration-none">New Arrivals</Link>
                <Link to={paths.customer.bestSellers} className="hover:text-accent decoration-none">Best Sellers</Link>
                <Link to={paths.customer.seasonalEssentials} className="hover:text-accent decoration-none">Seasonal Essentials</Link>
                <Link to={paths.customer.about} className="hover:text-accent decoration-none">About Brand</Link>
                <Link to={paths.customer.sustainability} className="hover:text-accent decoration-none">Eco-Commitments</Link>
                <Link to={paths.customer.blog} className="hover:text-accent decoration-none">Journal Blog</Link>
              </nav>
            </div>

            {/* Quick Profile / Help in mobile menu */}
            <div className="border-t border-unilo-border dark:border-gray-800 pt-4 space-y-3">
              <Link to={paths.customer.account} className="flex items-center gap-2 hover:text-accent decoration-none"><User className="w-4 h-4" /> Account Portal</Link>
              <Link to={paths.customer.help} className="flex items-center gap-2 hover:text-accent decoration-none"><HelpCircle className="w-4 h-4" /> Help Center</Link>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end animate-fade-in">
          <div className="w-80 md:w-[400px] h-full bg-white dark:bg-gray-900 flex flex-col justify-between animate-slide-up shadow-2xl">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-unilo-border dark:border-gray-800 flex justify-between items-center text-xs uppercase font-bold tracking-wider">
              <span className="font-heading font-black text-sm flex items-center gap-2">
                <ShoppingCart className="w-4.5 h-4.5" /> Shopping Cart ({totalQuantity})
              </span>
              <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-unilo-muted dark:hover:bg-gray-800 rounded-full border-none bg-transparent cursor-pointer text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content items list */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-xs">
                  <p className="text-gray-400 font-light">Your shopping cart is currently empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg border-none hover:opacity-90 cursor-pointer">
                    Continue Browsing
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center text-xs border-b border-unilo-border dark:border-gray-850 pb-3">
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-lg shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading font-bold text-gray-950 dark:text-white truncate m-0 leading-tight">
                        {item.name}
                      </h4>
                      <div className="text-gray-400 font-semibold mt-1">
                        ${(item.price / 23000).toFixed(0)} USD
                      </div>

                      {/* Quantity modifiers in drawer */}
                      <div className="flex items-center gap-2 border border-unilo-border dark:border-gray-800 w-fit rounded overflow-hidden bg-unilo-muted dark:bg-gray-850 mt-2 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-1.5 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent border-none cursor-pointer font-bold"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-[10px]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-1.5 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent border-none cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0 min-w-16">
                      <span className="font-bold text-gray-950 dark:text-white block">
                        ${((item.price * item.quantity) / 23000).toFixed(0)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] text-gray-400 hover:text-accent font-semibold border-none bg-transparent cursor-pointer mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer calculations */}
            {cartItems.length > 0 && (
              <div className="p-4 md:p-6 border-t border-unilo-border dark:border-gray-800 space-y-4">
                <div className="flex justify-between items-center text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-primary dark:text-white">
                    ${(cartSubtotal / 23000).toFixed(2)} USD
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate(paths.customer.checkout);
                  }}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl text-xs md:text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
                >
                  Checkout Now <ArrowRight className="w-4 h-4 text-white" />
                </button>
                <Link
                  to={paths.customer.cart}
                  onClick={() => setIsCartOpen(false)}
                  className="block text-center text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-accent hover:underline decoration-none"
                >
                  View Shopping Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
