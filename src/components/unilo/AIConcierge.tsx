import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { mockProducts, type Product } from '../../features/products';
import { useCartStore } from '../../stores/useCartStore';
import { toast } from 'react-toastify';

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
    <div className="p-6 bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-2xl w-full max-w-md animate-slide-up text-left">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-heading text-lg font-bold flex items-center gap-2">
          <Sparkles className="text-accent w-5 h-5 animate-pulse" />
          AI Size Advisor
        </h4>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {!result ? (
        <form onSubmit={calculateSize} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="e.g. 175"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="e.g. 68"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Fit Preference</label>
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
                  {pref}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all border-none mt-2 cursor-pointer">
            Calculate Best Fit
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4 animate-fade-in">
          <div className="text-sm text-gray-500">Based on your measurements, we suggest size:</div>
          <div className="text-5xl font-heading font-black text-primary dark:text-white">{result}</div>
          <p className="text-xs text-gray-400">This matches {product.name} styling guidelines.</p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                onSelectSize(result);
                onClose();
              }}
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border-none"
            >
              Apply Size {result}
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

  const availableAdditions = mockProducts.filter(
    (p) => !selectedItems.some((s) => s.id === p.id) && (p.category === 'outerwear' || p.category === 'accessories')
  );

  const toggleProduct = (product: Product) => {
    if (selectedItems.some((s) => s.id === product.id)) {
      setSelectedItems(selectedItems.filter((s) => s.id !== product.id));
    } else {
      setSelectedItems([...selectedItems, product]);
    }
  };

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = 0.15; // 15% discount for AI outfit bundle
  const discountedPrice = Math.round(totalPrice * (1 - bundleDiscount));

  const addBundleToCart = () => {
    selectedItems.forEach((item) => {
      // Find first variant size S
      const firstVar = item.variants[0];
      const sizeSelected = firstVar?.sizes.find(s => s.inventory > 0)?.size || 'M';
      const colorSelected = firstVar?.colorName || 'Default';

      addItem({
        id: `${item.id}-${colorSelected}-${sizeSelected}`,
        name: `${item.name} (${colorSelected} / ${sizeSelected})`,
        price: Math.round(item.price * (1 - bundleDiscount)),
        image: firstVar?.images[0] || ''
      }, 1);
    });
    toast.success('AI Outfit Bundle added to cart with 15% discount!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-2xl p-6 text-left shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-accent w-5 h-5 animate-pulse" />
        <h4 className="font-heading text-lg font-bold">AI Outfit Builder</h4>
      </div>
      <p className="text-xs text-gray-500 mb-6">Coordinate your wardrobe with high-converting AI recommendations and save 15% on bundle deals.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Current look preview */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Your Coordinates</h5>
          <div className="space-y-3">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex gap-3 items-center bg-unilo-muted dark:bg-gray-800 p-3 rounded-xl">
                <img src={item.variants[0]?.images[0]} alt={item.name} className="w-12 h-16 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-500 uppercase">{item.category}</div>
                  <h6 className="text-sm font-semibold truncate text-primary dark:text-white m-0">{item.name}</h6>
                  <div className="text-sm font-bold mt-0.5">${(item.price / 23000).toFixed(0)}</div>
                </div>
                {selectedItems.length > 1 && (
                  <button onClick={() => toggleProduct(item)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer">
                    <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Suggestions and bundle values */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Complete the Look Suggestions</h5>
            <div className="grid grid-cols-2 gap-2">
              {availableAdditions.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleProduct(item)}
                  className="flex items-center gap-2 p-2 border border-unilo-border dark:border-gray-800 hover:border-primary rounded-xl text-left bg-transparent cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <img src={item.variants[0]?.images[0]} alt={item.name} className="w-10 h-12 object-cover rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <h6 className="text-xs font-semibold truncate text-primary dark:text-white m-0">{item.name}</h6>
                    <div className="text-xs font-bold text-accent mt-0.5">+ Add</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-unilo-border dark:border-gray-800 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Individual Subtotal</span>
              <span className="font-semibold text-gray-400 line-through">${(totalPrice / 23000).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">AI Look Bundle Discount (15%)</span>
              <span className="text-accent font-bold">-${((totalPrice * bundleDiscount) / 23000).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span className="text-primary dark:text-white">Bundle Price</span>
              <span className="text-lg text-primary dark:text-white">${(discountedPrice / 23000).toFixed(2)}</span>
            </div>

            <button
              onClick={addBundleToCart}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-2"
            >
              Add Outfit Bundle <ArrowRight className="w-4 h-4" />
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
      text: 'Hello, welcome to UNILO. I am your AI Wardrobe Assistant. How can I help you curate your perfect minimalist wardrobe today?'
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
      let replyText = "I'm looking for our best minimalist essentials to match that! Check out these curated recommendations:";
      let recommendedProducts: Product[] = [];

      const normalized = userText.toLowerCase();

      if (normalized.includes('men') || normalized.includes('guy') || normalized.includes('boy')) {
        recommendedProducts = mockProducts.filter((p) => p.category === 'men' || p.category === 'essentials');
        replyText = "Here are some of UNILO's essential menswear recommendations, engineered for natural texture and versatile layering:";
      } else if (normalized.includes('women') || normalized.includes('girl') || normalized.includes('dress') || normalized.includes('trousers')) {
        recommendedProducts = mockProducts.filter((p) => p.category === 'women' || p.id === 'wide-trousers');
        replyText = "For effortless women's coordinates, I recommend our 3D knit fabrics and flowing trousers:";
      } else if (normalized.includes('cold') || normalized.includes('winter') || normalized.includes('coat') || normalized.includes('sweater') || normalized.includes('vest')) {
        recommendedProducts = mockProducts.filter((p) => p.category === 'outerwear' || p.id === 'merino-sweater');
        replyText = "To combat cool weather while maintaining a sharp minimal silhouette, try these premium layering essentials:";
      } else if (normalized.includes('active') || normalized.includes('sport') || normalized.includes('leggings') || normalized.includes('hoodie')) {
        recommendedProducts = mockProducts.filter((p) => p.category === 'active');
        replyText = "Our athletic activewear collection blends four-way stretch and Dry-EX moisture cooling, perfect for daily movement:";
      } else {
        recommendedProducts = [mockProducts[0], mockProducts[1], mockProducts[9]];
        replyText = "To begin your minimalist capsule wardrobe, we recommend starting with our bestselling fundamentals:";
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: replyText, products: recommendedProducts }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const navigateToProduct = (id: string) => {
    navigate(`/product/${id}`);
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
                <div className="text-[10px] text-gray-300">Everyday wardrobe curator</div>
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-unilo-muted dark:bg-gray-800 text-primary dark:text-white rounded-tl-none border border-unilo-border dark:border-gray-700'
                    }`}
                >
                  {msg.text}
                </div>
                {msg.products && (
                  <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                    {msg.products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => navigateToProduct(p.id)}
                        className="flex flex-col p-2 bg-white dark:bg-gray-800 border border-unilo-border dark:border-gray-700 rounded-xl hover:border-primary transition-all text-left bg-transparent cursor-pointer"
                      >
                        <img src={p.variants[0]?.images[0]} alt={p.name} className="w-full h-24 object-cover rounded-lg" />
                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate mt-1.5 w-full block">{p.name}</span>
                        <span className="text-xs font-semibold text-accent mt-0.5">${(p.price / 23000).toFixed(0)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs p-1 bg-unilo-muted dark:bg-gray-800 rounded-xl w-fit">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-150">●</span>
                <span className="animate-bounce delay-300">●</span>
                <span>AI typing...</span>
              </div>
            )}
          </div>

          {/* Input field */}
          <form onSubmit={handleSend} className="p-3 border-t border-unilo-border dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI Concierge for clothing recommendations..."
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
