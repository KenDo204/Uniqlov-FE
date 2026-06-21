import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {  X, Sparkles, ArrowRight, RefreshCw  } from '@/components/ui/icons';
import { mockProducts, type Product } from '../../features/products';
import { useCartStore } from '../../stores/useCartStore';
import { toast } from 'react-toastify';
import { formatVND } from '../../utils/formatters';

// AI Size Recommendation Engine interface
interface SizeCalculatorProps {
  product: Product;
  onSelectSize: (size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  onClose: () => void;
}

export function AISizeCalculator({ product, onSelectSize, onClose }: SizeCalculatorProps) {
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('65');
  const [fitPreference, setFitPreference] = useState<'fitted' | 'regular' | 'loose'>('regular');
  const [result, setResult] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | null>(null);

  const calculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w)) return;

    // A basic premium size estimation logic
    let sizeIndex: number;
    const bmi = w / ((h / 100) * (h / 100));

    if (h < 160) {
      sizeIndex = bmi < 20 ? 0 : 1; // XS or S
    } else if (h < 172) {
      sizeIndex = bmi < 21 ? 1 : 2; // S or M
    } else if (h < 182) {
      sizeIndex = bmi < 20 ? 2 : bmi < 25 ? 3 : 4; // M, L or XL
    } else {
      sizeIndex = bmi < 24 ? 4 : 5; // XL or XXL
    }

    // Apply fit preference
    if (fitPreference === 'fitted') {
      sizeIndex = Math.max(0, sizeIndex - 1);
    } else if (fitPreference === 'loose') {
      sizeIndex = Math.min(5, sizeIndex + 1);
    }

    const sizesArr: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const calculated = sizesArr[sizeIndex];
    setResult(calculated);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-2xl w-full max-w-md animate-slide-up text-left z-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-heading text-lg font-bold flex items-center gap-2">
          <Sparkles className="text-accent w-5 h-5 animate-pulse" />
          Gợi ý kích cỡ AI
        </h4>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer border-none bg-transparent">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {!result ? (
        <form onSubmit={calculateSize} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Chiều cao (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Ví dụ: 175"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cân nặng (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Ví dụ: 68"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sở thích phom dáng</label>
            <div className="grid grid-cols-3 gap-2">
              {(['fitted', 'regular', 'loose'] as const).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setFitPreference(pref)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${fitPreference === pref
                      ? 'bg-primary border-primary text-white'
                      : 'border-unilo-border text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                >
                  {pref === 'fitted' ? 'Ôm sát' : pref === 'regular' ? 'Vừa vặn' : 'Oversize'}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all border-none mt-2 cursor-pointer">
            Tính toán kích cỡ phù hợp
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4 animate-fade-in">
          <div className="text-sm text-gray-500">Dựa trên số đo cơ thể, kích cỡ khuyên dùng của bạn:</div>
          <div className="text-5xl font-heading font-black text-primary dark:text-white">{result}</div>
          <p className="text-xs text-gray-400">Đề xuất phù hợp với tiêu chuẩn thiết kế {product.product_name}.</p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                onSelectSize(result);
                onClose();
              }}
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border-none"
            >
              Áp dụng cỡ {result}
            </button>
            <button
              onClick={() => setResult(null)}
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm transition-all cursor-pointer border-none"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// AI Outfit Builder Component
export function AIOutfitBuilder() {
  const [selectedItems, setSelectedItems] = useState<Product[]>([
    mockProducts[0], // Cotton Tee
    mockProducts[9], // Chino Pants
  ]);
  const addItem = useCartStore((state) => state.addItem);

  const availableAdditions = useMemo(() => {
    return mockProducts.filter(
      (p) => !selectedItems.some((s) => s.product_id === p.product_id) && 
             (p.category_id === 'outerwear' || p.category_id === 'men' || p.category_id === 'women')
    );
  }, [selectedItems]);

  const toggleProduct = (product: Product) => {
    if (selectedItems.some((s) => s.product_id === product.product_id)) {
      setSelectedItems(selectedItems.filter((s) => s.product_id !== product.product_id));
    } else {
      setSelectedItems([...selectedItems, product]);
    }
  };

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.variants[0]?.price || 0), 0);
  }, [selectedItems]);

  const bundleDiscount = 0.15; // 15% discount for AI outfit bundle
  const discountedPrice = Math.round(totalPrice * (1 - bundleDiscount));

  const addBundleToCart = () => {
    selectedItems.forEach((item) => {
      const firstVar = item.variants[0];
      const sizeSelected = firstVar?.variant_attributes.size || 'M';
      const colorSelected = firstVar?.variant_attributes.colorName || 'Default';
      const price = firstVar?.price || 0;
      const image = firstVar?.variant_image || item.images[0]?.image_url || '';

      addItem({
        id: `${item.product_id}-${colorSelected}-${sizeSelected}`,
        name: `${item.product_name} (${colorSelected} / ${sizeSelected})`,
        price: Math.round(price * (1 - bundleDiscount)),
        image: image
      }, 1);
    });
    toast.success('Đã thêm trọn bộ trang phục AI với ưu đãi giảm 15%!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-2xl p-6 text-left shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-accent w-5 h-5 animate-pulse" />
        <h4 className="font-heading text-lg font-bold">AI Phối đồ tự động</h4>
      </div>
      <p className="text-xs text-gray-500 mb-6">Tự động đề xuất các trang phục đồng bộ và nhận ngay ưu đãi giảm giá 15% khi mua trọn bộ.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Current look preview */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Trang phục đang phối</h5>
          <div className="space-y-3">
            {selectedItems.map((item) => {
              const price = item.variants[0]?.price || 0;
              const image = item.variants[0]?.variant_image || item.images[0]?.image_url || '';
              return (
                <div key={item.product_id} className="flex gap-3 items-center bg-unilo-muted dark:bg-gray-800 p-3 rounded-xl">
                  <img src={image} alt={item.product_name} className="w-12 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-500 uppercase">{item.category_id}</div>
                    <h6 className="text-sm font-semibold truncate text-primary dark:text-white m-0">{item.product_name}</h6>
                    <div className="text-sm font-bold mt-0.5">{formatVND(price)}</div>
                  </div>
                  {selectedItems.length > 1 && (
                    <button onClick={() => toggleProduct(item)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer border-none bg-transparent">
                      <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Suggestions and bundle values */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Gợi ý hoàn thiện phong cách</h5>
            <div className="grid grid-cols-2 gap-2">
              {availableAdditions.slice(0, 4).map((item) => {
                const image = item.variants[0]?.variant_image || item.images[0]?.image_url || '';
                return (
                  <button
                    key={item.product_id}
                    onClick={() => toggleProduct(item)}
                    className="flex items-center gap-2 p-2 border border-unilo-border dark:border-gray-800 hover:border-primary rounded-xl text-left bg-transparent cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <img src={image} alt={item.product_name} className="w-10 h-12 object-cover rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <h6 className="text-xs font-semibold truncate text-primary dark:text-white m-0">{item.product_name}</h6>
                      <div className="text-xs font-bold text-accent mt-0.5">+ Thêm</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-unilo-border dark:border-gray-800 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tổng giá trị sản phẩm</span>
              <span className="font-semibold text-gray-400 line-through">{formatVND(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Giảm giá đồng bộ (15%)</span>
              <span className="text-accent font-bold">-{formatVND(Math.round(totalPrice * bundleDiscount))}</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span className="text-primary dark:text-white">Giá mua trọn bộ</span>
              <span className="text-lg text-primary dark:text-white">{formatVND(discountedPrice)}</span>
            </div>

            <button
              onClick={addBundleToCart}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-2"
            >
              Thêm bộ trang phục vào giỏ <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Shopping Assistant Floating Chat Concierge
export function AIShoppingConcierge() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; products?: Product[] }[]>([
    {
      role: 'assistant',
      text: 'Xin chào! Chào mừng đến với UNILO. Tôi là Trợ lý phong cách AI. Tôi có thể giúp bạn lựa chọn trang phục tối giản hoàn hảo nào hôm nay?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response based on keywords
    setTimeout(() => {
      let replyText = "Tôi đã tìm thấy các sản phẩm phù hợp nhất với phong cách của bạn! Hãy xem các gợi ý sau:";
      let recommendedProducts: Product[] = [];

      const normalized = userText.toLowerCase();

      if (normalized.includes('men') || normalized.includes('nam') || normalized.includes('trai')) {
        recommendedProducts = mockProducts.filter((p) => p.category_id === 'men' || p.category_id === 'essentials');
        replyText = "Dưới đây là một số đề xuất thời trang Nam cơ bản của UNILO dệt thoáng khí, lý tưởng cho việc mặc nhiều lớp:";
      } else if (normalized.includes('women') || normalized.includes('nữ') || normalized.includes('váy') || normalized.includes('quần')) {
        recommendedProducts = mockProducts.filter((p) => p.category_id === 'women' || p.product_slug === 'wide-trousers');
        replyText = "Đối với đồ nữ thanh lịch nhẹ nhàng, tôi gợi ý đầm dệt 3D và quần ống rộng rủ tự nhiên:";
      } else if (normalized.includes('lạnh') || normalized.includes('đông') || normalized.includes('ấm') || normalized.includes('khoác') || normalized.includes('len')) {
        recommendedProducts = mockProducts.filter((p) => p.category_id === 'outerwear' || p.product_slug === 'merino-sweater');
        replyText = "Để giữ ấm vào thời tiết se lạnh mà vẫn giữ nguyên form dáng tối giản gọn gàng, hãy thử các sản phẩm này:";
      } else if (normalized.includes('thao') || normalized.includes('chạy') || normalized.includes('active') || normalized.includes('sport')) {
        recommendedProducts = mockProducts.filter((p) => p.category_id === 'active');
        replyText = "Dòng đồ thể thao activewear kết hợp công nghệ Dry-EX mát lạnh co giãn bốn chiều cực kỳ phù hợp cho vận động hàng ngày:";
      } else {
        recommendedProducts = [mockProducts[0], mockProducts[1], mockProducts[9]];
        replyText = "Để bắt đầu tủ đồ tối giản gọn gàng của bạn, tôi khuyên dùng các sản phẩm cơ bản bán chạy nhất sau:";
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: replyText, products: recommendedProducts }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const navigateToProduct = (slug: string) => {
    navigate(`/product/${slug}`);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded chat window */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[480px] bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 shadow-2xl rounded-2xl flex flex-col mb-4 overflow-hidden animate-slide-up text-left">
          {/* Header */}
          <div className="p-4 bg-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <div>
                <div className="font-heading font-bold text-sm">UNILO AI Concierge</div>
                <div className="text-[10px] text-gray-300">Trợ lý phong cách cá nhân</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full border-none bg-transparent cursor-pointer text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm text-left ${msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-unilo-muted dark:bg-gray-800 text-primary dark:text-white rounded-tl-none border border-unilo-border dark:border-gray-700'
                    }`}
                >
                  {msg.text}
                </div>
                {msg.products && (
                  <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                    {msg.products.map((p) => {
                      const image = p.variants[0]?.variant_image || p.images[0]?.image_url || '';
                      const price = p.variants[0]?.price || 0;
                      return (
                        <button
                          key={p.product_id}
                          onClick={() => navigateToProduct(p.product_slug)}
                          className="flex flex-col p-2 bg-white dark:bg-gray-800 border border-unilo-border dark:border-gray-700 rounded-xl hover:border-primary transition-all text-left bg-transparent cursor-pointer"
                        >
                          <img src={image} alt={p.product_name} className="w-full h-24 object-cover rounded-lg" />
                          <span className="text-xs font-bold text-gray-900 dark:text-white truncate mt-1.5 w-full block">{p.product_name}</span>
                          <span className="text-xs font-semibold text-accent mt-0.5">{formatVND(price)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs p-1 bg-unilo-muted dark:bg-gray-800 rounded-xl w-fit">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-150">●</span>
                <span className="animate-bounce delay-300">●</span>
                <span>AI đang phân tích...</span>
              </div>
            )}
          </div>

          {/* Input field */}
          <form onSubmit={handleSend} className="p-3 border-t border-unilo-border dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi AI Concierge về tư vấn quần áo..."
              className="flex-1 px-3 py-2 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white placeholder-gray-400"
            />
            <button type="submit" className="p-2.5 bg-primary hover:bg-black text-white rounded-xl cursor-pointer border-none flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating button trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-black text-white p-4 rounded-full shadow-2xl flex items-center gap-2 border-none cursor-pointer hover:scale-105 transition-all duration-300 font-bold group"
          title="UNILO AI Chat Concierge"
        >
          <Sparkles className="w-5 h-5 text-accent animate-pulse group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-heading font-bold uppercase tracking-wider pr-1 hidden sm:inline text-white">AI Concierge</span>
        </button>
      )}
    </div>
  );
}
