import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Menu } from '@/components/ui/icons';
import { SearchBox } from '@/components/shared/SearchBox';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '@/stores/useCartStore';
import EasyMall_Logo from '@/assets/icons/EasyMall_Logo.png';
import { HeaderMegaMenu } from './HeaderMegaMenu';
import { BRAND } from '@/constants/brand';
import { CartDrawer } from '@/components/shared/CartDrawer';

// 1. Import useAuth từ tầng Hook của chúng ta
import { useAuth } from '@/hooks/useAuth';
import AvatarNav from '@/components/customer/Navbar/AvatarNav';
import MobileNav from '@/components/customer/Navbar/MobileNav';

export function Header() {
    const location = useLocation();
    
    // 2. Lấy trạng thái đăng nhập từ Hook
    const { isAuthenticated, user } = useAuth();
    
    const { items: cartItems } = useCartStore();

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // States
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    // Close drawers on path change
    useEffect(() => {
        setIsCartOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Lắng nghe event mở giỏ hàng từ bất kỳ đâu (ví dụ: ProductCard sau khi Add to cart)
    useEffect(() => {
        const handleOpenCart = () => setIsCartOpen(true);
        window.addEventListener('open-cart-drawer', handleOpenCart);
        return () => window.removeEventListener('open-cart-drawer', handleOpenCart);
    }, []);

    const headerContainerClass = "sticky left-0 top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-unilo-border shadow-sm pointer-events-auto transition-colors";

    // Màu icon
    const iconClass = `text-gray-700 hover:text-theme`;

    return (
        <>
            <header className={headerContainerClass}>
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto flex flex-wrap items-center justify-between pt-2 lg:h-20 lg:pt-0 lg:flex-nowrap">

                    {/* 1. LOGO */}
                    <Link to="/" className="flex flex-col shrink-0 decoration-none group order-1">
                        <img
                            src={EasyMall_Logo}
                            alt={`${BRAND.NAME} Logo`}
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />
                    </Link>

                    {/* 2. CỤM PHẢI: SEARCH + ICONS */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0 order-2 lg:order-3">

                        {/* 2. SEARCH BOX */}
                        <div className="flex-1 w-full max-w-[400px] xl:max-w-[500px]">
                            <SearchBox 
                                placeholder="Bạn đang tìm sản phẩm gì?"
                                className="w-full h-9 sm:h-10"
                            />
                        </div>

                        {/* 3. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP */}
                        {isAuthenticated ? (
                            <>
                                <Link to="/account/wishlists" className={`p-1.5 sm:p-2 rounded-full transition-colors hidden sm:flex items-center justify-center ${iconClass}`}>
                                    <Heart size={20} strokeWidth={1.5} />
                                </Link>
                                
                                {/* Đã bổ sung sự kiện mở giỏ hàng và Badge hiển thị số lượng */}
                                <button 
                                    onClick={() => setIsCartOpen(true)}
                                    className={`p-1.5 sm:p-2 rounded-full transition-colors relative border-none bg-transparent cursor-pointer flex items-center justify-center ${iconClass}`}
                                >
                                    <ShoppingCart size={20} strokeWidth={1.5} />
                                    {totalQuantity > 0 && (
                                        <span className="absolute 0 top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                            {totalQuantity}
                                        </span>
                                    )}
                                </button>
                                
                                <AvatarNav user={user} />
                            </>
                        ) : (
                            // Nút Đăng nhập cho người dùng chưa auth
                            <Link 
                                to="/login" 
                                className="px-4 py-2 bg-theme hover:bg-theme-hover text-white text-sm font-bold rounded-full transition-colors decoration-none hidden sm:block"
                            >
                                Đăng nhập
                            </Link>
                        )}

                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`lg:hidden p-1.5 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center ${iconClass}`}
                        >
                            <Menu size={22} strokeWidth={1.5} />
                        </button>

                    </div>

                    {/* 3. MENU - Truyền prop isHome vào để đổi màu chữ */}
                    <div className="order-3 lg:order-2 w-full basis-full lg:basis-auto lg:flex-1 lg:px-8 overflow-x-auto scrollbar-hide border-white/20 lg:border-none pt-2 lg:pt-0">
                        <HeaderMegaMenu />
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer Overlay */}
            <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            {/* Cart Drawer Overlay */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}