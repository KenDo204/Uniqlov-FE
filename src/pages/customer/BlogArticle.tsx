import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, ShoppingCart } from 'lucide-react';
import { mockBlogEntries } from './Blog';
import { mockProducts } from '../../features/products';
import { paths } from '../../config/paths';
import { useCartStore } from '../../stores/useCartStore';
import { toast } from 'react-toastify';

export function BlogArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  // Retrieve current entry
  const entry = useMemo(() => {
    return mockBlogEntries.find((e) => e.id === id) || mockBlogEntries[0];
  }, [id]);

  // Related product to showcase inside the blog (e.g. Supima Tee for Supima article)
  const matchingProduct = useMemo(() => {
    if (entry.id.includes('supima')) return mockProducts.find(p => p.id === 'cotton-tee') || mockProducts[0];
    if (entry.id.includes('merino')) return mockProducts.find(p => p.id === 'merino-sweater') || mockProducts[1];
    return mockProducts.find(p => p.id === 'wool-coat') || mockProducts[3];
  }, [entry]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard!');
  };

  const handleQuickAdd = () => {
    const firstVar = matchingProduct.variants[0];
    const size = firstVar?.sizes.find(s => s.inventory > 0)?.size || 'M';
    const color = firstVar?.colorName || 'Default';

    addItem({
      id: `${matchingProduct.id}-${color}-${size}`,
      name: `${matchingProduct.name} (${color} / ${size})`,
      price: matchingProduct.price,
      image: firstVar?.images[0] || ''
    }, 1);
    toast.success(`Added ${matchingProduct.name} to cart.`);
  };

  return (
    <div className="max-w-3xl mx-auto text-left bg-unilo-muted min-h-screen pb-12 space-y-8 animate-fade-in">
      {/* Back to Blog */}
      <button
        onClick={() => navigate(paths.customer.blog)}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary border-none bg-transparent cursor-pointer p-0"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Journal
      </button>

      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-bold">{entry.category}</span>
        <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-tight m-0 text-primary dark:text-white">
          {entry.title}
        </h1>
        <div className="flex items-center justify-between text-xs text-gray-400 font-semibold border-y border-unilo-border dark:border-gray-800 py-3">
          <div className="flex items-center gap-3">
            <span>By UNILO Editors</span>
            <span>•</span>
            <span>{entry.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {entry.readTime}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 hover:text-primary cursor-pointer border-none bg-transparent text-gray-400 font-bold"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>

      {/* Image Cover */}
      <div className="h-[350px] md:h-[450px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <img src={entry.image} alt={entry.title} className="w-full h-full object-cover object-center" />
      </div>

      {/* Article Content */}
      <article className="prose prose-sm md:prose-base dark:prose-invert font-light text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 text-xs md:text-sm">
        <p>
          At UNILO, we approach clothing design through the lens of longevity and structural detail. In a fast-moving fashion environment where trends change in weeks, we focus on material integrity and anatomical comfort.
        </p>
        <p className="font-semibold text-primary dark:text-white text-sm md:text-base pt-2">
          "Garments are not decorative canvases. They are functional coordinates intended for the motion of daily life."
        </p>
        <p>
          We inspect materials at the microscopic level. Standard fabrics use short-staple cotton fibers that fray easily after friction and washing, leading to fuzzy pilling and structural stretching. Our choice of Supima long-staple cotton and double-spun extrafine Australian Merino wool prevents pilling and maintains color fastness across years.
        </p>
        <p>
          By stripping down unnecessary accessories and loud branded symbols, we allow the drape of the fabric and cleanliness of the cut to speak for itself.
        </p>
      </article>

      {/* Inline Product card widget */}
      {matchingProduct && (
        <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex gap-4 items-center w-full sm:w-auto">
            <img src={matchingProduct.variants[0]?.images[0]} alt={matchingProduct.name} className="w-14 h-18 object-cover rounded-lg shrink-0" />
            <div>
              <span className="text-[9px] uppercase font-bold text-accent">Meticulously Featured Product</span>
              <h4 className="font-heading font-bold text-sm text-primary dark:text-white m-0 truncate max-w-[280px]">
                {matchingProduct.name}
              </h4>
              <p className="text-gray-400 font-semibold mt-0.5">${(matchingProduct.price / 23000).toFixed(0)} USD</p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate(paths.customer.productDetail.replace(':id', matchingProduct.id))}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-gray-100 dark:bg-gray-800 text-primary dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all cursor-pointer border-none"
            >
              Learn More
            </button>
            <button
              onClick={handleQuickAdd}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-primary text-white font-bold rounded-xl hover:opacity-95 transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
