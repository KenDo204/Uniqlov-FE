/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, Undo2, ShieldCheck, HelpCircle, AlertTriangle, Plus, Check } from 'lucide-react';
import { useFetchProducts, mockProducts } from '../../features/products';
import { useCartStore } from '../../stores/useCartStore';
import { AISizeCalculator } from '../../components/unilo/AIConcierge';
import { paths } from '../../config/paths';
import { toast } from 'react-toastify';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { data: products } = useFetchProducts();

  // Find product
  const product = useMemo(() => {
    const raw = products || mockProducts;
    return raw.find((p) => p.id === id) || raw[0];
  }, [products, id]);

  // States
  const [selectedColor, setSelectedColor] = useState<string>(product.variants[0]?.colorName || '');
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping' | 'returns'>('details');
  const [showSizeAdvisor, setShowSizeAdvisor] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Sync selected color if product changes
  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.variants[0]?.colorName || '');
      setSelectedSize('');
      setQuantity(1);
      setActiveGalleryIndex(0);
    }
  }, [product]);

  const activeVariant = useMemo(() => {
    return product.variants.find((v) => v.colorName === selectedColor) || product.variants[0];
  }, [product, selectedColor]);

  const activeSizeInfo = useMemo(() => {
    if (!selectedSize) return null;
    return activeVariant?.sizes.find((s) => s.size === selectedSize) || null;
  }, [activeVariant, selectedSize]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select an apparel size.');
      return;
    }
    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: `${product.name} (${selectedColor} / ${selectedSize})`,
      price: product.price,
      image: activeVariant?.images[0] || ''
    }, quantity);
    toast.success(`Added ${quantity}x ${product.name} to cart.`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select an apparel size.');
      return;
    }
    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: `${product.name} (${selectedColor} / ${selectedSize})`,
      price: product.price,
      image: activeVariant?.images[0] || ''
    }, quantity);
    navigate(paths.customer.checkout);
  };

  // Coordinates Bundle: "Complete the Look" (first 2 related products)
  const bundleItems = useMemo(() => {
    const raw = products || mockProducts;
    return raw.filter((p) => product.relatedProductIds.includes(p.id)).slice(0, 2);
  }, [products, product]);

  const addBundleToCart = () => {
    // Add current item
    if (!selectedSize) {
      toast.error('Select a size for the main product first.');
      return;
    }
    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: `${product.name} (${selectedColor} / ${selectedSize})`,
      price: Math.round(product.price * 0.9), // 10% discount on bundle
      image: activeVariant?.images[0] || ''
    }, 1);

    // Add coordinate items
    bundleItems.forEach((item) => {
      const firstVar = item.variants[0];
      const size = firstVar?.sizes.find(s => s.inventory > 0)?.size || 'M';
      const color = firstVar?.colorName || 'Default';
      addItem({
        id: `${item.id}-${color}-${size}`,
        name: `${item.name} (${color} / ${size})`,
        price: Math.round(item.price * 0.9),
        image: firstVar?.images[0] || ''
      }, 1);
    });

    toast.success('Complete the Look bundle added with 10% discount!');
  };

  return (
    <div className="space-y-16 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Breadcrumbs */}
      <div className="text-xs text-gray-400">
        <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</span> /{' '}
        <span className="hover:text-primary cursor-pointer" onClick={() => navigate(paths.customer.men)}>Collection</span> /{' '}
        <span className="text-gray-600 font-semibold">{product.name}</span>
      </div>

      {/* Above fold content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="h-[480px] md:h-[600px] bg-white border border-unilo-border dark:border-gray-800 rounded-2xl overflow-hidden relative group">
            <img
              src={activeVariant?.images[activeGalleryIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <button
              onClick={() => toast.success('Added to Wishlist.')}
              className="absolute top-4 right-4 p-3 bg-white/80 hover:bg-white dark:bg-black/40 backdrop-blur rounded-full text-gray-500 hover:text-accent cursor-pointer border-none shadow-sm transition-colors"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {activeVariant?.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGalleryIndex(idx)}
                className={`w-20 h-24 rounded-lg overflow-hidden border shrink-0 cursor-pointer bg-white ${activeGalleryIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-unilo-border dark:border-gray-800'
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product controls */}
        <div className="space-y-6 bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 md:p-8 rounded-2xl">
          {/* Header info */}
          <div className="space-y-2">
            <div className="text-xs uppercase font-bold tracking-widest text-accent">{product.category}</div>
            <h1 className="text-2xl md:text-3xl font-heading font-black tracking-tight m-0 text-primary dark:text-white">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-yellow-400 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                ))}
                <span className="text-xs text-gray-500 font-semibold ml-1.5 hover:underline cursor-pointer">
                  {product.reviewsCount} reviews
                </span>
              </div>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">In Stock</span>
            </div>
            <div className="text-2xl font-bold text-primary dark:text-white pt-2">
              ${(product.price / 23000).toFixed(2)} USD
            </div>
          </div>

          {/* Color swatches */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Color: {selectedColor}</span>
            </div>
            <div className="flex gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedColor(v.colorName);
                    setActiveGalleryIndex(0);
                  }}
                  style={{ backgroundColor: v.colorCode }}
                  className={`w-8 h-8 rounded-full border cursor-pointer relative transition-all ${selectedColor === v.colorName ? 'border-primary ring-2 ring-primary/40 scale-105' : 'border-gray-200 dark:border-gray-700 hover:scale-105'
                    }`}
                  title={v.colorName}
                >
                  {selectedColor === v.colorName && (
                    <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${v.colorName === 'Off-White' || v.colorName === 'Pure Linen White' ? 'text-primary' : 'text-white'}`}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes and Advisor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
              <span>Size: {selectedSize || 'Select Size'}</span>
              <button
                onClick={() => setShowSizeAdvisor(true)}
                className="text-xs text-accent font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer hover:underline"
              >
                Find My Size
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {activeVariant?.sizes.map((s) => {
                const isOutOfStock = s.inventory === 0;
                return (
                  <button
                    key={s.size}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(s.size)}
                    className={`py-3 text-xs font-bold border rounded-xl transition-all cursor-pointer ${isOutOfStock
                        ? 'border-gray-100 bg-gray-50 text-gray-300 dark:bg-gray-800/40 cursor-not-allowed line-through'
                        : selectedSize === s.size
                          ? 'bg-primary border-primary text-white scale-102'
                          : 'border-unilo-border text-primary dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>

            {/* AI Size recommendation banner */}
            {showSizeAdvisor && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                <AISizeCalculator
                  product={product}
                  onSelectSize={(sz) => setSelectedSize(sz)}
                  onClose={() => setShowSizeAdvisor(false)}
                />
              </div>
            )}

            {/* Inventory Urgency */}
            {activeSizeInfo && activeSizeInfo.inventory < 15 && activeSizeInfo.inventory > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-950/20 p-2.5 rounded-lg border border-orange-200/40">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Urgency Alert! Only {activeSizeInfo.inventory} units remaining in size {selectedSize}.</span>
              </div>
            )}
          </div>

          {/* Quantity selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Quantity</span>
            <div className="flex items-center border border-unilo-border dark:border-gray-800 w-fit rounded-xl overflow-hidden bg-white dark:bg-gray-850">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="py-2.5 px-4 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent border-none cursor-pointer"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold text-center w-12">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="py-2.5 px-4 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent border-none cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary border-none cursor-pointer text-sm"
            >
              Add To Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full btn-accent border-none cursor-pointer text-sm"
            >
              Buy It Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 border-t border-unilo-border dark:border-gray-800 pt-4 text-[10px] uppercase font-bold text-gray-500 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-4 h-4 text-accent" />
              <span>Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Undo2 className="w-4 h-4 text-accent" />
              <span>30-Day Return</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Below fold */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Specifications / Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-unilo-border dark:border-gray-800 text-sm font-bold uppercase tracking-wider text-gray-500">
            {([
              { key: 'details', label: 'Description' },
              { key: 'fabric', label: 'Fabric Details' },
              { key: 'shipping', label: 'Shipping' },
              { key: 'returns', label: 'Returns' }
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-4 border-b-2 bg-transparent border-none cursor-pointer -mb-0.5 transition-colors ${activeTab === tab.key
                    ? 'border-primary text-primary dark:text-white dark:border-white font-extrabold'
                    : 'border-transparent hover:text-primary dark:hover:text-white'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl leading-relaxed text-xs md:text-sm text-gray-600 dark:text-gray-300">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <p className="font-light">{product.longDescription}</p>
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Key Features</h4>
                  <ul className="list-disc pl-5 space-y-1.5 font-light">
                    {product.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'fabric' && <p className="font-light">{product.fabricDetails}</p>}
            {activeTab === 'shipping' && <p className="font-light">{product.shippingData}</p>}
            {activeTab === 'returns' && <p className="font-light">{product.returnsData}</p>}
          </div>

          {/* Standard FAQ accordion */}
          <div className="space-y-3 pt-4">
            <h3 className="font-heading font-black text-lg m-0 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gray-400" /> FAQ
            </h3>
            <div className="space-y-2">
              {[
                { q: 'Will this item shrink in the wash?', a: 'All our items are pre-shrunk during the garment wash process to ensure they retain their shape. However, we suggest washing cold and laying flat to dry.' },
                { q: 'Where are the materials sourced?', a: 'Our materials are ethically sourced. Supima cotton is grown in the USA, and our fine Merino wool is sourced from sustainable Australian farms.' }
              ].map((faq, idx) => (
                <details key={idx} className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl p-4 cursor-pointer group">
                  <summary className="font-semibold text-xs md:text-sm uppercase tracking-wider text-primary dark:text-white flex justify-between items-center select-none">
                    <span>{faq.q}</span>
                    <span className="transition-transform group-open:rotate-180">↓</span>
                  </summary>
                  <p className="mt-3 text-xs md:text-sm text-gray-500 font-light leading-relaxed leading-normal">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Complete the Look */}
        {bundleItems.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl shadow-sm text-left">
              <h3 className="font-heading font-bold text-base m-0 border-b border-unilo-border dark:border-gray-800 pb-3 flex items-center gap-2">
                Complete The Look
              </h3>
              <p className="text-[11px] text-gray-400 mt-2 mb-4">Pair this product with recommended coords and get 10% off the entire look.</p>

              <div className="space-y-4">
                {/* Main product representation */}
                <div className="flex gap-3 items-center">
                  <img src={activeVariant?.images[0]} alt={product.name} className="w-12 h-16 object-cover rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Current Item</span>
                    <h4 className="text-xs font-bold truncate text-primary dark:text-white m-0">{product.name}</h4>
                    <span className="text-xs font-semibold">${(product.price / 23000).toFixed(0)}</span>
                  </div>
                  <span className="p-1 bg-green-500 text-white rounded-full"><Check className="w-3.5 h-3.5" /></span>
                </div>

                {/* Bundle additions */}
                {bundleItems.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center pt-3 border-t border-unilo-border dark:border-gray-850">
                    <img src={item.variants[0]?.images[0]} alt={item.name} className="w-12 h-16 object-cover rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-bold text-accent">{item.category}</span>
                      <h4 className="text-xs font-bold truncate text-primary dark:text-white m-0">{item.name}</h4>
                      <span className="text-xs font-semibold">${(item.price / 23000).toFixed(0)}</span>
                    </div>
                    <span className="p-1 bg-primary text-white rounded-full"><Plus className="w-3.5 h-3.5" /></span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <button
                onClick={addBundleToCart}
                className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-xl text-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              >
                Buy Look Bundle (10% Off) <ShoppingBag className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <section className="space-y-6 border-t border-unilo-border dark:border-gray-800 pt-12">
        <h3 className="font-heading font-black text-xl m-0">Customer Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Average Rating details */}
          <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-xl text-center space-y-4">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Overall Rating</h4>
            <div className="text-5xl font-heading font-black text-primary dark:text-white">{product.rating}</div>
            <div className="flex justify-center text-yellow-400 gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <div className="text-xs text-gray-500">Based on {product.reviewsCount} verified reviews</div>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2 space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-primary dark:text-white">{rev.author}</span>
                    <span className="text-gray-400 block">{rev.date}</span>
                  </div>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-heading font-bold text-sm text-primary dark:text-white m-0">{rev.title}</h4>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">"{rev.comment}"</p>
                </div>

                <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase pt-2 border-t border-unilo-border dark:border-gray-850">
                  {rev.verified && <span className="text-green-500">✓ Verified Buyer</span>}
                  <span>Fit: <span className="text-accent">{rev.fit}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
