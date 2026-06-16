import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Search, User, Heart, ShoppingCart } from 'lucide-react';
import { paths } from '@/config/paths';
import { useCartStore } from '@/stores/useCartStore';
import { BRAND } from '@/constants/brand';

export function Footer() {
    const { items: cartItems} = useCartStore();

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);


  return (
    <>
      <footer className="w-full border-t border-unilo-border dark:border-gray-800 bg-muted dark:bg-gray-950 pt-16 pb-12 md:pb-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 text-left">
            {/* Branding Column */}
            <div className="md:col-span-2 space-y-6">
              <h4 className="font-heading font-black text-2xl uppercase text-primary dark:text-white m-0 tracking-widest">
                {BRAND.NAME}
              </h4>
              <p className="text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-sm m-0">
                {BRAND.SLOGAN}
              </p>
              <div className="flex space-x-6 pt-2">
                <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300"><FaFacebook className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300"><FaInstagram className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300"><FaTwitter className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300"><FaYoutube className="w-6 h-6" /></a>
              </div>
            </div>

            {/* Collections */}
            <div className="space-y-6">
              <h5 className="text-sm font-bold uppercase text-primary dark:text-white tracking-widest mb-4">Collections</h5>
              <div className="flex flex-col gap-4 text-base text-gray-500 dark:text-gray-400 font-medium">
                <Link to={paths.customer.men} className="hover:text-accent transition-colors decoration-none">Men Range</Link>
                <Link to={paths.customer.women} className="hover:text-accent transition-colors decoration-none">Women Range</Link>
                <Link to={paths.customer.newArrivals} className="hover:text-accent transition-colors decoration-none">New Arrivals</Link>
                <Link to={paths.customer.bestSellers} className="hover:text-accent transition-colors decoration-none">Bestsellers</Link>
              </div>
            </div>

            {/* Company details */}
            <div className="space-y-6">
              <h5 className="text-sm font-bold uppercase text-primary dark:text-white tracking-widest mb-4">Company</h5>
              <div className="flex flex-col gap-4 text-base text-gray-500 dark:text-gray-400 font-medium">
                <Link to={paths.customer.about} className="hover:text-accent transition-colors decoration-none">Our Story</Link>
                <Link to={paths.customer.sustainability} className="hover:text-accent transition-colors decoration-none">Ecology Commit</Link>
                <Link to={paths.customer.blog} className="hover:text-accent transition-colors decoration-none">{BRAND.NAME} Journal</Link>
              </div>
            </div>

            {/* Help / Services */}
            <div className="space-y-6">
              <h5 className="text-sm font-bold uppercase text-primary dark:text-white tracking-widest mb-4">Support</h5>
              <div className="flex flex-col gap-4 text-base text-gray-500 dark:text-gray-400 font-medium">
                <Link to={paths.customer.help} className="hover:text-accent transition-colors decoration-none">Help FAQs</Link>
                <Link to={paths.customer.contact} className="hover:text-accent transition-colors decoration-none">Contact Support</Link>
                <Link to={paths.customer.help} className="hover:text-accent transition-colors decoration-none">Returns Policy</Link>
              </div>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="border-t border-unilo-border dark:border-gray-800 pt-8 flex justify-center items-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            <p className="m-0">&copy; {new Date().getFullYear()} {BRAND.COPYRIGHT}</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Thumb Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-unilo-border dark:border-gray-800 py-3 px-4 flex justify-around items-center z-40 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <Link to="/" className="flex flex-col items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 hover:text-accent transition-colors decoration-none">
          <span className="w-6 h-6 flex items-center justify-center font-heading font-black text-lg">U</span>
          <span>Home</span>
        </Link>
        <Link to={paths.customer.search} className="flex flex-col items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 hover:text-accent transition-colors decoration-none">
          <Search className="w-5 h-5" />
          <span>Search</span>
        </Link>
        <Link
          to={paths.customer.cart}
          className="flex flex-col items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 hover:text-accent transition-colors decoration-none relative"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {totalQuantity > 0 && (
            <span className="absolute -top-1 -right-2 bg-accent text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalQuantity}
            </span>
          )}
        </Link>
        <Link to={paths.customer.wishlist} className="flex flex-col items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 hover:text-accent transition-colors decoration-none">
          <Heart className="w-5 h-5" />
          <span>Wishlist</span>
        </Link>
        <Link to={paths.customer.account} className="flex flex-col items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 hover:text-accent transition-colors decoration-none">
          <User className="w-5 h-5" />
          <span>Account</span>
        </Link>
      </nav>
    </>
  );
}