import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  ArrowLeft, Clock, Share2, ShoppingCart  } from '@/components/ui/icons';
import { mockBlogEntries } from './Blog';
import { mockProducts } from '../../features/products';
import { paths } from '../../config/paths';
import { useCartStore } from '../../stores/useCartStore';
import { toast } from 'react-toastify';
import { formatVND } from '../../utils/formatters';

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
    const raw = mockProducts;
    if (entry.id.includes('supima')) return raw.find(p => p.product_slug === 'cotton-tee') || raw[0];
    if (entry.id.includes('merino')) return raw.find(p => p.product_slug === 'merino-sweater') || raw[1];
    return raw.find(p => p.product_slug === 'wool-coat') || raw[3];
  }, [entry]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép liên kết bài viết!');
  };

  const handleQuickAdd = () => {
    const firstVar = matchingProduct.variants[0];
    const size = firstVar?.variant_attributes.size || 'M';
    const color = firstVar?.variant_attributes.colorName || 'Default';
    const price = firstVar?.price || 0;
    const image = firstVar?.variant_image || matchingProduct.images[0]?.image_url || '';

    addItem({
      id: `${matchingProduct.product_id}-${color}-${size}`,
      name: `${matchingProduct.product_name} (${color} / ${size})`,
      price: price,
      image: image
    }, 1);
    toast.success(`Đã thêm ${matchingProduct.product_name} vào giỏ hàng.`);
  };

  return (
    <div className="max-w-3xl mx-auto text-left bg-unilo-muted min-h-screen pb-12 space-y-8 animate-fade-in">
      {/* Back to Blog */}
      <button
        onClick={() => navigate(paths.customer.blog)}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-primary border-none bg-transparent cursor-pointer p-0"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Journal
      </button>

      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-bold">{entry.category}</span>
        <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-tight m-0 text-primary dark:text-white">
          {entry.title}
        </h1>
        <div className="flex items-center justify-between text-xs text-gray-400 font-semibold border-y border-unilo-border dark:border-gray-800 py-3">
          <div className="flex items-center gap-3">
            <span>UNILO Editors</span>
            <span>•</span>
            <span>{entry.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {entry.readTime}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 hover:text-primary cursor-pointer border-none bg-transparent text-gray-400 font-bold"
          >
            <Share2 className="w-4 h-4" /> Chia sẻ
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
          Tại UNILO, chúng tôi tiếp cận thiết kế quần áo thông qua lăng kính của sự bền bỉ và chi tiết cấu trúc tối ưu. Trong một thế giới thời trang nhanh thay đổi liên tục, chúng tôi chọn tập trung vào sự hoàn thiện của vật liệu và sự thoải mái mang tính giải phẫu cơ thể.
        </p>
        <p className="font-semibold text-primary dark:text-white text-sm md:text-base pt-2">
          "Trang phục không phải là tấm toan trang trí đơn thuần. Chúng là tọa độ chức năng hỗ trợ cho chuyển động của cuộc sống hàng ngày."
        </p>
        <p>
          Chúng tôi kiểm tra chất liệu từ cấp độ hiển vi. Các loại vải thông thường sử dụng sợi bông ngắn dễ xơ mọc lông sau khi giặt và ma sát. Lựa chọn của chúng tôi là sợi bông Supima sợi dài cao cấp và len Merino siêu mịn nhập khẩu giữ được form dáng và bền màu qua nhiều năm sử dụng.
        </p>
        <p>
          Bằng cách loại bỏ những chi tiết rườm rà và nhãn hiệu in nổi ồn ào, chúng tôi để cho độ rủ tự nhiên của vải và phom dáng tối giản tự nói lên giá trị của chính nó.
        </p>
      </article>

      {/* Inline Product card widget */}
      {matchingProduct && (
        <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex gap-4 items-center w-full sm:w-auto">
            <img src={matchingProduct.images[0]?.image_url} alt={matchingProduct.product_name} className="w-14 h-18 object-cover rounded-lg shrink-0" />
            <div>
              <span className="text-[9px] uppercase font-bold text-accent">Sản phẩm nổi bật được đề xuất</span>
              <h4 className="font-heading font-bold text-sm text-primary dark:text-white m-0 truncate max-w-[280px]">
                {matchingProduct.product_name}
              </h4>
              <p className="text-gray-400 font-semibold mt-0.5">{formatVND(matchingProduct.variants[0]?.price || 0)}</p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate(paths.customer.productDetail.replace(':id', matchingProduct.product_slug))}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-gray-100 dark:bg-gray-800 text-primary dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all cursor-pointer border-none"
            >
              Chi tiết
            </button>
            <button
              onClick={handleQuickAdd}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-primary text-white font-bold rounded-xl hover:opacity-95 transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Mua ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
