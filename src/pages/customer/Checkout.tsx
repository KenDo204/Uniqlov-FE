import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { toast } from 'react-toastify';

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      toast.info('Your cart is empty. Directing you to store.');
      navigate('/');
    }
  }, [items, navigate]);

  // Form states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Auto-complete mock
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const mockSuggestedAddresses = [
    '742 Evergreen Terrace, Springfield, OR',
    '1600 Amphitheatre Pkwy, Mountain View, CA',
    '221B Baker Street, London, UK',
    '1 Infinite Loop, Cupertino, CA'
  ];

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);
    if (val.length > 3) {
      setAddressSuggestions(mockSuggestedAddresses.filter(a => a.toLowerCase().includes(val.toLowerCase())));
    } else {
      setAddressSuggestions([]);
    }
  };

  const selectSuggestedAddress = (addr: string) => {
    setAddress(addr);
    setAddressSuggestions([]);
    // Auto-fill other fields based on select
    if (addr.includes('Springfield')) {
      setCity('Springfield');
      setZip('97477');
    } else if (addr.includes('Mountain View')) {
      setCity('Mountain View');
      setZip('94043');
    } else if (addr.includes('London')) {
      setCity('London');
      setZip('NW1 6XE');
    } else if (addr.includes('Cupertino')) {
      setCity('Cupertino');
      setZip('95014');
    }
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === 'UNILO10' || code === 'WELCOME') {
      setDiscountPercent(0.1);
      toast.success('10% Coupon applied!');
    } else {
      toast.error('Invalid coupon code.');
    }
  };

  // Financials
  const rawSubtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const discountAmount = Math.round(rawSubtotal * discountPercent);
  const subtotal = rawSubtotal - discountAmount;
  const shippingCost = rawSubtotal >= 1725000 || rawSubtotal === 0 ? 0 : 115000;
  const total = subtotal + shippingCost;

  // Checkout process simulation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !address || !city || !zip) {
      toast.error('Please fill in shipping credentials.');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      toast.error('Please input payment details.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart();
      toast.success('Order placed successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-8 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Checkout Progress Header */}
      <div className="flex justify-between items-center border-b border-unilo-border dark:border-gray-800 pb-4">
        <h1 className="text-2xl md:text-3xl font-heading font-black m-0">Secure Checkout</h1>
        <div className="flex items-center gap-1.5 text-xs text-green-500 font-bold uppercase tracking-wider bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-lg border border-green-200/40">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL Encryption Active</span>
        </div>
      </div>

      {orderSuccess ? (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-8 rounded-2xl text-center space-y-6 shadow-md animate-fade-in">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-black m-0">Thank You For Your Order!</h2>
            <p className="text-xs md:text-sm text-gray-500 font-light">Your order confirmation has been emailed to you. Standard shipping estimates take 3-5 business days.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full btn-primary border-none cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Customer Info */}
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0 border-b border-unilo-border dark:border-gray-850 pb-2 flex items-center gap-2">
                1. Customer Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
                <div className="flex items-end text-xs text-gray-400 italic font-light pb-2.5">
                  Register later for order updates and tracking points.
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Info */}
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0 border-b border-unilo-border dark:border-gray-850 pb-2 flex items-center gap-2">
                2. Shipping Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Address Auto Complete */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Type address for autocomplete suggestions..."
                  className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                  required
                />

                {addressSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-gray-850 border border-unilo-border dark:border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-unilo-border dark:divide-gray-800 text-xs">
                    {addressSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuggestedAddress(suggestion)}
                        className="px-4 py-3 hover:bg-unilo-muted dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-200"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. San Francisco"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">ZIP Code</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="e.g. 94103"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Payment Options */}
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0 border-b border-unilo-border dark:border-gray-850 pb-2 flex items-center gap-2">
                3. Secure Payment Methods
              </h3>

              {/* Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'card'
                      ? 'bg-primary border-primary text-white'
                      : 'border-unilo-border text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900'
                    }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'apple'
                      ? 'bg-primary border-primary text-white'
                      : 'border-unilo-border text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900'
                    }`}
                >
                  <span className="font-heading font-black text-xs lowercase"> Pay</span>
                  <span>Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('google')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'google'
                      ? 'bg-primary border-primary text-white'
                      : 'border-unilo-border text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900'
                    }`}
                >
                  <span className="font-heading font-black text-xs uppercase text-blue-500">G Pay</span>
                  <span>Google Pay</span>
                </button>
              </div>

              {/* Details rendering */}
              {paymentMethod === 'card' ? (
                <div className="space-y-4 pt-2 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="•••• •••• •••• ••••"
                      className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">CVV Security Code</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-unilo-muted dark:bg-gray-800 rounded-xl text-center text-xs text-gray-500 font-light border border-dashed border-unilo-border dark:border-gray-700 py-6 animate-fade-in">
                  Authenticate payment overlay securely when clicking the purchase button.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar calculations */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-base m-0 border-b border-unilo-border dark:border-gray-850 pb-3">
                Order Items
              </h3>

              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center text-xs">
                    <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold truncate text-primary dark:text-white m-0">{item.name}</h4>
                      <span className="text-gray-400">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">${((item.price * item.quantity) / 23000).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* Sidebar Coupon code input */}
              <div className="flex gap-2 pt-2 border-t border-unilo-border dark:border-gray-850">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 px-3 py-2 bg-unilo-muted dark:bg-gray-850 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:opacity-95 cursor-pointer border-none"
                >
                  Apply
                </button>
              </div>

              {/* Pricing metrics */}
              <div className="space-y-3 text-xs md:text-sm border-t border-unilo-border dark:border-gray-850 pt-4">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Subtotal</span>
                  <span>${(rawSubtotal / 23000).toFixed(2)} USD</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between items-center text-accent">
                    <span>Coupon Discount</span>
                    <span>-${(discountAmount / 23000).toFixed(2)} USD</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-500">
                  <span>Shipping Cost</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-500 font-bold uppercase tracking-wider text-[10px]">Free</span>
                  ) : (
                    <span>${(shippingCost / 23000).toFixed(2)} USD</span>
                  )}
                </div>
                <div className="flex justify-between items-center font-black text-sm md:text-base border-t border-unilo-border dark:border-gray-850 pt-3 text-primary dark:text-white">
                  <span>Total Due</span>
                  <span>${(total / 23000).toFixed(2)} USD</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary border-none cursor-pointer flex items-center justify-center gap-2 text-xs md:text-sm"
              >
                {isSubmitting ? 'Processing Payment...' : `Authorize Payment • $${(total / 23000).toFixed(2)}`}
                {!isSubmitting && <ArrowRight className="w-4 h-4 text-white" />}
              </button>

              <div className="text-[10px] text-gray-400 font-medium text-center space-y-1.5">
                <p className="m-0 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure Payments Powered by Stripe
                </p>
                <p className="m-0 font-light">By checking out you accept UNILO Terms of Service.</p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
