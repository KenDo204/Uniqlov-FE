import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Menu, AccountIcon } from '@/components/ui/icons';
import { SearchBox } from '@/components/shared/SearchBox';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/useCartStore';
import EasyMall_Logo from '@/assets/icons/logo1.png';
import { BRAND } from '@/constants/brand';
import { CartDrawer } from '@/components/shared/CartDrawer';

// 1. Import useAuth từ tầng Hook của chúng ta
import { useAuth } from '@/hooks/useAuth';
import AvatarNav from '@/components/customer/Navbar/AvatarNav';
import MobileNav from '@/components/customer/Navbar/MobileNav';
import { Container } from '@/components/shared/Container';

import { cn } from '@/lib/utils';
import { Button } from '@mui/material';

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();
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
            <Container className="pointer-events-auto flex flex-wrap items-center justify-between py-2 lg:py-0 lg:h-20">

                <div className="flex items-center justify-start w-[25%] sm:w-[30%] lg:hidden order-1">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={cn("p-1 rounded-md border-none bg-transparent cursor-pointer flex flex-col items-center justify-center text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50", iconClass)}
                >
                    <Menu size={26} strokeWidth={1.5} />
                    <span className="text-[10px] font-medium leading-none mt-1">Menu</span>
                </button>
                </div>

                <div className="flex items-center justify-center lg:justify-start w-[50%] sm:w-[40%] lg:w-auto shrink-0 order-2 lg:order-1 transition-all duration-300">
                <Link to="/" className="flex items-center justify-center lg:justify-start no-underline group">
                    <img
                    src={EasyMall_Logo}
                    alt={`${BRAND.NAME} Logo`}
                    className="h-5 sm:h-6 md:h-7 lg:h-9 w-auto object-contain transition-all duration-300 group-hover:opacity-80"
                    />
                </Link>
                </div>

                <div className="order-4 lg:order-2 w-full basis-full shrink-0 mt-3 lg:mt-0 lg:basis-auto lg:flex-1 lg:max-w-[480px] xl:max-w-[560px] lg:px-4">
                <SearchBox
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full h-10 lg:h-11 text-sm border border-gray-200 focus-within:border-neutral-900 transition-colors rounded-sm"
                />
                </div>

                <div className="flex items-center justify-end w-[25%] sm:w-[30%] lg:w-auto gap-2 sm:gap-4 shrink-0 order-3 lg:order-3">
                {isAuthenticated ? (
                    <>
                    <div className="scale-90 md:scale-100 hidden sm:block">
                        <AvatarNav user={user} />
                    </div>

                    {/* Icon Trái Tim */}
                    <Link
                        to="/account/wishlists"
                        className={cn("p-1.5 rounded-full transition-colors items-center justify-center hidden sm:flex hover:bg-neutral-100", iconClass)}
                    >
                        <Heart size={24} strokeWidth={1.5} />
                    </Link>

                    {/* Icon Giỏ Hàng & Badge */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className={cn("p-1.5 rounded-full transition-colors relative border-none bg-transparent cursor-pointer flex items-center justify-center hover:bg-neutral-100", iconClass)}
                    >
                        <ShoppingCart size={26} strokeWidth={1.5} />
                        {totalQuantity > 0 && (
                        <span className="absolute top-0 right-0 transform translate-x-[10%] -translate-y-[10%] bg-[#E32636] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                            {totalQuantity}
                        </span>
                        )}
                    </button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        startIcon={<AccountIcon sx={{ fontSize: "12px" }} />}
                        onClick={() => navigate("/login")}
                        sx={{ bgcolor: '#00927c', '&:hover': { bgcolor: '#007a68' } }}
                    >
                        Đăng nhập
                    </Button>
                )}
                </div>

            </Container>
            </header>

            {/* Mobile Menu Drawer Overlay */}
            <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            {/* Cart Drawer Overlay */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}