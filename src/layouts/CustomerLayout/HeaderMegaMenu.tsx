import { useState } from 'react';
import { Link } from 'react-router-dom';
import {  Search, X  } from '@/components/ui/icons';
import { mockCategories } from '@/constants/mock-categories';
import EasyMall_Logo from '@/assets/icons/EasyMall_Logo.png';

export function HeaderMegaMenu() {

  const [activeCategory, setActiveCategory] = useState<typeof mockCategories[0] | null>(null);

  const closeMenu = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  };

    return (
      <div 
        className="relative w-full flex-1 h-full flex items-center"
        onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="flex w-full justify-between lg:justify-start lg:space-x-2 h-full items-center">
          {mockCategories.map((category) => (
            <div
              key={category.category_id}
              className="h-full flex items-center"
              // Khi hover vào danh mục nào thì mở overlay của danh mục đó lên ngay lập tức
              onMouseEnter={() => setActiveCategory(category)}
            >
              <button 
                className={`relative flex items-center justify-center h-10 lg:h-17 px-0 md:px-3 lg:px-4 text-[14px] md:text-[16px] font-bold md:font-light uppercase tracking-wide bg-transparent rounded-none border-b-2 transition-all cursor-pointer border-transparent text-gray-700 hover:text-theme ${
                  activeCategory?.category_id === category.category_id ? 'font-bold' : ''
                }`}
              >
                {category.category_name}
              </button>
            </div>
          ))}
        </div>

        {activeCategory && (
          <div 
            className="fixed top-0 left-0 w-screen h-[85dvh] bg-white z-[9999] shadow-2xl transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-4"
            // Đảm bảo khi di chuột bên trong không gian của Overlay thì menu luôn mở
            onMouseEnter={() => setActiveCategory(activeCategory)}
          >
            <div className={`w-full min-h-full bg-white text-theme pb-24 max-w-[1200px] mx-auto text-left`}>
              
              <div className="flex items-center justify-between px-4 lg:px-8 h-16 lg:h-20">
                <div className="flex items-center gap-8 lg:gap-16">
                    
                    {/* Logo ô vuông đỏ đặc trưng */}
                    <Link to="/" className="flex gap-[2px] cursor-pointer hover:opacity-90" onClick={closeMenu}>
                    <img 
                        src={EasyMall_Logo} 
                        alt="EasyMall Logo" 
                        className="w-16 h-16 md:w-20 md:h-20 object-contain" 
                    />
                    </Link>

                    {/* Danh mục (Đóng vai trò Tab ảo hiển thị trạng thái) */}
                    <div className="hidden md:flex gap-6 lg:gap-8 text-[14px] uppercase tracking-wide mt-2">
                      {mockCategories.map((c) => (
                        <span 
                          key={c.category_id} 
                          onMouseEnter={() => setActiveCategory(c)}
                        className={`cursor-pointer transition-all pb-1 ${
                          c.category_id === activeCategory.category_id 
                            ? `font-bold text-theme text-[16px]` 
                            : `text-gray-700 font-light hover:text-theme`
                        }`}
                      >
                      {c.category_name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setActiveCategory(null)} 
                  className={`p-2 cursor-pointer hover:text-theme rounded-full transition-colors border-none bg-transparent flex items-center justify-center`}
                >
                  <X 
                  className="w-7 h-7 text-gray-700 hover:text-theme" 
                  strokeWidth={1.5} 
                  />
                </button>
              </div>
            </div>

            <div className="max-w-[850px] mx-auto px-4 mb-16 mt-4">
              <form className="relative flex items-center shadow-sm rounded-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" strokeWidth={1.5} />
                <input 
                  type="text" 
                  placeholder="Bạn đang tìm sản phẩm gì?" 
                  className="w-full text-gray-700 border border-gray-300 rounded-full py-3.5 pl-14 pr-6 outline-none hover:border-gray-400 focus:border-black text-[14px] transition-colors" 
                />
              </form>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12 text-center">
                {activeCategory.items.map((item, itemIdx) => (
                  <Link 
                    key={itemIdx} 
                    to={item.target_url} 
                    onClick={() => setActiveCategory(null)}
                    className="flex flex-col items-center group decoration-none cursor-pointer"
                  >
                    <div className="w-24 h-24 md:w-28 md:h-28 lg:w-[130px] lg:h-[130px] mb-4 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
                      <img
                        src={item.icon_url}
                        alt={item.category_name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <span className="text-[12px] md:text-[13px] font-normal uppercase text-gray-800 leading-snug px-2 max-w-[160px]">
                      {item.category_name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
