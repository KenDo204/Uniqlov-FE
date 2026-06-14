import { useState } from 'react';
import { HelpCircle, BookOpen, AlertCircle, ShoppingBag } from 'lucide-react';

export function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'shipping' | 'returns' | 'sizing' | 'all'>('all');

  const faqs = [
    { cat: 'shipping', q: 'How long does standard shipping take?', a: 'Standard shipping inside the US and Europe takes 3-5 business days. International deliveries can take 7-14 business days depending on customs clearance.' },
    { cat: 'shipping', q: 'Is shipping free?', a: 'Yes! Standard delivery is free on all orders above $75. Orders under $75 are subject to a flat $5 standard shipping charge.' },
    { cat: 'returns', q: 'What is the UNILO return policy?', a: 'We accept returns within 30 days of shipment delivery. Items must be in original unworn condition with tags still attached. Pre-paid returns labels are included in all packages.' },
    { cat: 'returns', q: 'How long do refunds take to process?', a: 'Once your returned package is received at our facility, refunds are processed within 3-5 business days and returned to your original payment method.' },
    { cat: 'sizing', q: 'How do I know what size to order?', a: 'You can use our AI Size Advisor on any product detail page. Alternatively, refer to our standard measurements guide: XS (Waist 28"), S (Waist 30"), M (Waist 32"), L (Waist 34"), XL (Waist 36").' }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.cat === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Header */}
      <div className="border-b border-unilo-border dark:border-gray-800 pb-6 text-center max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-heading font-black m-0 tracking-tight">Help Center & FAQs</h1>
        <p className="text-xs md:text-sm text-gray-500 m-0 font-light">Find shipping details, size tables, return guides, and product care guidelines.</p>
        <input
          type="text"
          placeholder="Search topics by keyword (e.g. shipping, refund)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {([
            { key: 'all', label: 'All Articles', icon: BookOpen },
            { key: 'shipping', label: 'Shipping Timelines', icon: ShoppingBag },
            { key: 'returns', label: 'Returns & Refunds', icon: AlertCircle },
            { key: 'sizing', label: 'Sizing Metrics', icon: HelpCircle }
          ] as const).map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer border-none text-left ${activeCategory === cat.key
                    ? 'bg-primary text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQs accordion */}
        <div className="lg:col-span-3 space-y-3">
          {filteredFaqs.map((faq, idx) => (
            <details key={idx} className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl p-5 cursor-pointer group">
              <summary className="font-semibold text-xs md:text-sm uppercase tracking-wider text-primary dark:text-white flex justify-between items-center select-none">
                <span>{faq.q}</span>
                <span className="transition-transform group-open:rotate-180">↓</span>
              </summary>
              <p className="mt-4 text-xs md:text-sm text-gray-500 font-light leading-relaxed leading-normal m-0">{faq.a}</p>
            </details>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="text-center text-gray-400 p-8">No articles found. Try checking other topics.</div>
          )}
        </div>
      </div>
    </div>
  );
}
