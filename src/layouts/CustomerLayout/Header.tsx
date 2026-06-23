import { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingCart, HelpCircle, Menu, ArrowRight, X } from '@/components/ui/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/stores/useCartStore';
import { paths } from '@/config/paths';
import EasyMall_Logo from '@/assets/icons/EasyMall_Logo.png';
import { HeaderMegaMenu } from './HeaderMegaMenu';
import { formatVND } from '@/utils/formatters';
import { BRAND } from '@/constants/brand';

// 1. Import useAuth từ tầng Hook của chúng ta
import { useAuth } from '@/hooks/useAuth';

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 2. Lấy trạng thái đăng nhập từ Hook
    const { isAuthenticated } = useAuth();
    
    const { items: cartItems, removeItem, updateQuantity } = useCartStore();

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // States
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close drawers on path change
    useEffect(() => {
        setIsCartOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const headerContainerClass = "sticky left-0 top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-unilo-border shadow-sm pointer-events-auto transition-colors";

    // Màu icon
    const iconClass = `text-gray-700 hover:text-theme`;

    // Thanh tìm kiếm
    const searchBgClass = "bg-white/95 hover:bg-white";

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

                        {/* Thanh tìm kiếm */}
                        <div className="relative hidden md:block w-48 md:w-64 lg:w-[320px] mr-1 sm:mr-2">
                            <form className={`flex items-center transition-colors rounded-full px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm ${searchBgClass}`}>
                                <Search className="text-gray-500 w-4 h-4 mr-2 sm:mr-2.5 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Bạn đang tìm sản phẩm gì?"
                                    className="bg-transparent border-none outline-none w-full text-xs sm:text-sm text-gray-800 dark:text-white placeholder-gray-500 font-medium"
                                />
                            </form>
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
                                
                                <Link to="/account" className={`p-1.5 sm:p-2 rounded-full transition-colors hidden sm:flex items-center justify-center ${iconClass}`}>
                                    <User size={20} strokeWidth={1.5} />
                                </Link>
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
            {isMobileMenuOpen && (
                // ... (Phần code Drawer Mobile giữ nguyên không đổi)
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-fade-in lg:hidden">
                    <div className="w-64 h-full bg-white dark:bg-gray-900 p-6 space-y-6 flex flex-col justify-between animate-slide-up text-xs font-bold uppercase tracking-wider">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-unilo-border dark:border-gray-800 pb-4">
                                <span className="font-heading font-black text-sm text-primary dark:text-white">{BRAND.NAME} Điều hướng</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-unilo-muted rounded-full border-none bg-transparent cursor-pointer">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-4 text-left">
                                <Link to={paths.customer.men} className="hover:text-accent decoration-none">Nam</Link>
                                <Link to={paths.customer.women} className="hover:text-accent decoration-none">Nữ</Link>
                                <Link to={paths.customer.newArrivals} className="hover:text-accent decoration-none">Sản phẩm mới</Link>
                                <Link to={paths.customer.bestSellers} className="hover:text-accent decoration-none">Bán chạy nhất</Link>
                                <Link to={paths.customer.seasonalEssentials} className="hover:text-accent decoration-none">Trang phục theo mùa</Link>
                                <Link to={paths.customer.about} className="hover:text-accent decoration-none">Về thương hiệu</Link>
                                <Link to={paths.customer.sustainability} className="hover:text-accent decoration-none">Thời trang bền vững</Link>
                                <Link to={paths.customer.blog} className="hover:text-accent decoration-none">Bản tin Journal</Link>
                            </nav>
                        </div>

                        <div className="border-t border-unilo-border dark:border-gray-800 pt-4 space-y-3">
                            {/* Cập nhật UI Mobile menu tùy trạng thái đăng nhập */}
                            {isAuthenticated ? (
                                <Link to={paths.customer.account} className="flex items-center gap-2 hover:text-accent decoration-none"><User className="w-4 h-4" /> Tài khoản cá nhân</Link>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 hover:text-accent decoration-none"><User className="w-4 h-4" /> Đăng nhập</Link>
                            )}
                            <Link to={paths.customer.help} className="flex items-center gap-2 hover:text-accent decoration-none"><HelpCircle className="w-4 h-4" /> Trung tâm hỗ trợ</Link>
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
                                <ShoppingCart className="w-4.5 h-4.5" /> Giỏ hàng ({totalQuantity})
                            </span>

                            <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-unilo-muted dark:hover:bg-gray-800 rounded-full border-none bg-transparent cursor-pointer text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content items list */}

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-xs">
                                    <p className="text-gray-400 font-light">Giỏ hàng của bạn hiện đang trống.</p>
                                    <button onClick={() => setIsCartOpen(false)} className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg border-none hover:opacity-90 cursor-pointer">
                                        Tiếp tục mua sắm
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center text-xs border-b border-unilo-border dark:border-gray-850 pb-3 text-left">
                                        <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-lg shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-heading font-bold text-gray-950 dark:text-white truncate m-0 leading-tight">
                                                {item.name}
                                            </h4>
                                            <div className="text-gray-400 font-semibold mt-1">
                                                {formatVND(item.price)}
                                            </div>
                                            {/* Quantity modifiers in drawer */}
                                            <div className="flex items-center gap-2 border border-unilo-border dark:border-gray-800 w-fit rounded overflow-hidden bg-unilo-muted dark:bg-gray-855 mt-2 shrink-0">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-1.5 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent border-none cursor-pointer font-bold animate-active"
                                                >
                                                    -
                                                </button>
                                                <span className="w-5 text-center font-bold text-[10px]">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-1.5 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent border-none cursor-pointer font-bold animate-active"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 min-w-16">
                                            <span className="font-bold text-gray-955 dark:text-white block">
                                                {formatVND(item.price * item.quantity)}
                                            </span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-[10px] text-gray-400 hover:text-accent font-semibold border-none bg-transparent cursor-pointer mt-1"
                                            >
                                                Xóa
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
                                    <span>Tạm tính</span>
                                    <span className="text-primary dark:text-white">
                                        {formatVND(cartSubtotal)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        navigate(paths.customer.checkout);
                                    }}
                                    className="w-full py-3 bg-primary text-white font-bold rounded-xl text-xs md:text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
                                >
                                    Thanh toán ngay <ArrowRight className="w-4 h-4 text-white" />
                                </button>
                                <Link
                                    to={paths.customer.cart}
                                    onClick={() => setIsCartOpen(false)}
                                    className="block text-center text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-accent  decoration-none"
                                >
                                    Xem giỏ hàng chi tiết
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}