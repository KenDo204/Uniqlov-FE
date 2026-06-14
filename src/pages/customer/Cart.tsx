import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ArrowRight, ShieldCheck, Ticket, Sparkles } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { mockProducts } from '../../features/products';
import { paths } from '../../config/paths';
import { toast } from 'react-toastify';

export function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, addItem } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Financial calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * appliedDiscount);
  const subtotal = rawSubtotal - discountAmount;

  // Free shipping limit: $75 USD (approx 1,725,000 VND)
  const FREE_SHIPPING_LIMIT = 1725000;
  const progressPercent = Math.min(100, (rawSubtotal / FREE_SHIPPING_LIMIT) * 100);
  const remainingForFree = Math.max(0, FREE_SHIPPING_LIMIT - rawSubtotal);

  const shippingCost = rawSubtotal >= FREE_SHIPPING_LIMIT || rawSubtotal === 0 ? 0 : 115000; // $5 equivalent
  const total = subtotal + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'UNILO10' || code === 'WELCOME') {
      setAppliedDiscount(0.1); // 10% discount
      setCouponSuccess(true);
      toast.success('Promo code applied: 10% Off your subtotal.');
    } else {
      toast.error('Invalid promo code.');
    }
  };

  const handleCheckout = () => {
    navigate(paths.customer.checkout);
  };

  // Cross-sell recommendations (first 3 items from products that aren't already in the cart)
  const crossSellItems = mockProducts.filter(p => !items.some(i => i.id.startsWith(p.id))).slice(0, 3);

  const handleAddCrossSell = (product: typeof mockProducts[0]) => {
    const firstVar = product.variants[0];
    const size = firstVar?.sizes.find(s => s.inventory > 0)?.size || 'M';
    const color = firstVar?.colorName || 'Default';

    addItem({
      id: `${product.id}-${color}-${size}`,
      name: `${product.name} (${color} / ${size})`,
      price: product.price,
      image: firstVar?.images[0] || ''
    }, 1);
    toast.success(`Added ${product.name} to cart.`);
  };

  return (
    <div className="space-y-8 text-left bg-unilo-muted min-h-screen pb-12">
      <h1 className="text-3xl font-heading font-black m-0 border-b border-unilo-border dark:border-gray-800 pb-4">
        Shopping Cart <span className="text-sm font-normal text-gray-500">({items.length} items)</span>
      </h1>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-16 rounded-2xl text-center space-y-4">
          <p className="text-gray-400 font-light text-base">Your shopping cart is currently empty.</p>
          <button
            onClick={() => navigate(paths.customer.men)}
            className="btn-primary border-none cursor-pointer text-xs"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress Bar */}
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-5 rounded-2xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-gray-600 dark:text-gray-300">
                  {remainingForFree > 0
                    ? `Add $${(remainingForFree / 23000).toFixed(0)} USD more for FREE standard shipping`
                    : 'Congratulations! You qualify for FREE standard shipping'}
                </span>
                <span className="text-accent">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-unilo-muted dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="bg-accent h-full transition-all duration-500"
                />
              </div>
            </div>

            {/* List of Cart Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-4 md:p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm animate-fade-in"
                >
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-xl shrink-0" />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white truncate m-0">
                      {item.name}
                    </h3>
                    <div className="text-xs text-gray-400 font-semibold mt-1">
                      ${(item.price / 23000).toFixed(2)} USD
                    </div>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center border border-unilo-border dark:border-gray-800 rounded-lg overflow-hidden bg-unilo-muted dark:bg-gray-800 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent border-none cursor-pointer font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 font-bold text-xs text-center w-8">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent border-none cursor-pointer font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right shrink-0 min-w-16">
                    <span className="font-bold text-xs md:text-sm text-gray-900 dark:text-white block">
                      ${((item.price * item.quantity) / 23000).toFixed(0)} USD
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-gray-400 hover:text-red-500 font-semibold cursor-pointer border-none bg-transparent mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cross-Sell Recommendations */}
            {crossSellItems.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-400">Frequently Bought Together</h3>
                <div className="grid grid-cols-3 gap-4">
                  {crossSellItems.map((prod) => (
                    <div key={prod.id} className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-3 rounded-xl flex flex-col justify-between space-y-3 shadow-sm text-left">
                      <div className="space-y-1">
                        <img src={prod.variants[0]?.images[0]} alt={prod.name} className="w-full h-24 object-cover rounded-lg" />
                        <h4 className="text-[11px] font-bold text-primary dark:text-white truncate mt-1.5 m-0">{prod.name}</h4>
                        <span className="text-[10px] text-gray-400 font-semibold">${(prod.price / 23000).toFixed(0)}</span>
                      </div>
                      <button
                        onClick={() => handleAddCrossSell(prod)}
                        className="py-1 px-2.5 bg-primary text-white text-[9px] font-black uppercase tracking-wider rounded-lg border-none hover:opacity-90 active:scale-[0.98] cursor-pointer text-center"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checkout sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-base m-0 border-b border-unilo-border dark:border-gray-800 pb-3">
                Order Summary
              </h3>

              {/* Coupon inputs */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white uppercase placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 bg-primary text-white font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer border-none"
                >
                  Apply
                </button>
              </form>

              {couponSuccess && (
                <div className="text-[10px] text-green-500 font-bold bg-green-50 dark:bg-green-950/20 p-2 rounded-lg border border-green-200/40 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Promo Code UNILO10 Applied (10% Off)</span>
                </div>
              )}

              {/* Price calculations breakdown */}
              <div className="space-y-3 text-xs md:text-sm border-t border-unilo-border dark:border-gray-850 pt-4">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(rawSubtotal / 23000).toFixed(2)} USD
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-accent">
                    <span>Discount</span>
                    <span className="font-bold">
                      -${(discountAmount / 23000).toFixed(2)} USD
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-gray-500">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-500 font-bold uppercase tracking-wider text-[10px]">Free</span>
                  ) : (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(shippingCost / 23000).toFixed(2)} USD
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center font-black text-sm md:text-base border-t border-unilo-border dark:border-gray-850 pt-3 text-primary dark:text-white">
                  <span>Total</span>
                  <span>${(total / 23000).toFixed(2)} USD</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary border-none cursor-pointer flex items-center justify-center gap-2 text-xs md:text-sm"
              >
                Proceed To Checkout <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <div className="text-[10px] text-gray-400 font-medium text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                <span>Secure SSL Checkout Guarantee.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
