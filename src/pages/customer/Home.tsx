import { useState, useEffect, useMemo } from 'react';
import {
  HeroBanner,
  BestSellers,
  NewArrivals,
} from '@/components/customer/Home';
import { mockCategories } from '@/constants/mock-categories';
import { mockDataHome } from '@/constants/mock-data-home';
import { BRAND } from '@/constants/brand';
import { useProduct } from '@/hooks/useProduct';
import { mapProductResponseToProduct } from '@/utils/mappers';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'react-toastify';

export function Home() {
  const data = mockDataHome.data;
  const { products: rawProducts, isFetching, error, fetchPublicProducts } = useProduct();
  const addItem = useCartStore((state) => state.addItem);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchPublicProducts().catch((err) => {
      console.error('Error fetching home products:', err);
    });
  }, [fetchPublicProducts]);

  const mappedProducts = useMemo(() => {
    return (rawProducts || []).map(mapProductResponseToProduct);
  }, [rawProducts]);

  const handleAddToCart = (product: any, e: React.MouseEvent, selectedColor?: string) => {
    e.stopPropagation();
    const activeColor = selectedColor || product.options_config.colors[0]?.colorName || 'Default';
    const activeVariant = product.variants.find((v: any) => v.variant_attributes.colorName === activeColor) || product.variants[0];
    const size = activeVariant?.variant_attributes.size || 'M';
    const price = activeVariant?.price || product.variants[0]?.price || 0;
    const image = activeVariant?.variant_image || product.images[0]?.image_url || '';

    addItem({
      id: `${product.product_id}-${activeColor}-${size}`,
      name: `${product.product_name} (${activeColor} / ${size})`,
      price: price,
      image: image
    }, 1);

    toast.success(`Đã thêm ${product.product_name} vào giỏ hàng.`);
  };

  if (!data) return null;

  return (
    <div className="space-y-20 w-full text-left bg-unilo-muted">
      {/* SECTION 1: HERO */}
      <HeroBanner />

      {/* SECTION 3: BEST SELLERS */}
      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <div className="w-8 h-8 border-3 border-[#00927c] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">Đang tải sản phẩm bán chạy...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <p className="text-red-500 text-sm">Lỗi tải sản phẩm: {error}</p>
        </div>
      ) : mappedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <p className="text-gray-400 text-sm">Chưa có sản phẩm nào nổi bật.</p>
        </div>
      ) : (
        <BestSellers products={mappedProducts} onAddToCart={handleAddToCart} />
      )}

      {/* SECTION 5: NEW ARRIVALS */}
      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <div className="w-8 h-8 border-3 border-[#00927c] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">Đang tải sản phẩm mới...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <p className="text-red-500 text-sm">Lỗi tải sản phẩm: {error}</p>
        </div>
      ) : mappedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <p className="text-gray-400 text-sm">Chưa có sản phẩm mới nào.</p>
        </div>
      ) : (
        <NewArrivals products={mappedProducts} onAddToCart={handleAddToCart} />
      )}

      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
        <h3 className="text-xl md:text-2xl font-medium text-center mb-12">Tìm theo danh mục</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-4">
          {mockCategories[0].items.slice(0, 6).map((cat) => (
            <div key={cat.category_id} className="flex flex-col items-center group cursor-pointer text-center">
              <div className="w-20 h-20 md:w-28 md:h-28 mb-4 transition-transform duration-300 group-hover:-translate-y-2">
                <img src={cat.icon_url} alt={cat.category_name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <span className="text-[11px] md:text-xs font-medium uppercase text-gray-700 group-hover:text-black tracking-wide leading-snug">
                {cat.category_name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* <section className="w-full relative h-[60vh] md:h-[85vh]">
        <img 
          src={data.sliders[0].image_url} 
          alt="Main Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent text-white">
          <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3 font-semibold">CẢN GIÓ . TRƯỢT NƯỚC . CHỐNG UV</p>
          <h2 className="text-4xl md:text-6xl font-light mb-4 uppercase tracking-wide">ÁO KHOÁC</h2>
          <p className="text-sm md:text-base font-light max-w-3xl text-center px-4 leading-relaxed opacity-90">
            Che chắn tối đa dưới mọi thời tiết. Trải nghiệm công nghệ RainShield™ trượt nước, chất liệu siêu nhẹ cản gió và khả năng chống tia UV vượt trội.
          </p>
        </div>
      </section> */}

      {/* ========================================== */}
      {/* SECTION 3: CÁC KHỐI CAMPAIGN (Hình 3, 4)   */}
      {/* ========================================== */}
      {data.campaignBlocks.map((campaign) => (
        <CampaignBlock key={campaign.id} data={campaign} />
      ))}

      {/* ========================================== */}
      {/* SECTION 4: PHỤ KIỆN BENTO BOX (Hình 7, 8)  */}
      {/* ========================================== */}
      <section className="bg-[#f8f8f8] py-20 mt-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold uppercase mb-3 tracking-wide">Phụ Kiện Thời Trang</h3>
            <p className="text-sm text-gray-500">Những món đồ cần thiết và tiện dụng mỗi ngày</p>
          </div>

          {/* Tabs phụ kiện */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 uppercase text-xs md:text-sm font-semibold tracking-wider">
            <button className="bg-black text-white px-8 py-2.5 rounded-full border-none cursor-pointer hover:bg-gray-800 transition-colors">NÓN</button>
            <button className="text-gray-400 hover:text-black bg-transparent border-none cursor-pointer transition-colors">VÍ</button>
            <button className="text-gray-400 hover:text-black bg-transparent border-none cursor-pointer transition-colors">DÂY NỊT</button>
            <button className="text-gray-400 hover:text-black bg-transparent border-none cursor-pointer transition-colors">TÚI ĐEO</button>
          </div>

          {/* Grid Phụ Kiện (Bento Box Layout) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

            {/* Cột 1 (2 ảnh dọc) */}
            <div className="flex flex-col gap-4 md:gap-6">
              <AccessoryCard img="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" title="LƯỚI MESH THOÁNG" price="68.000đ" />
              <AccessoryCard img="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80" title="KAKI ĐỨNG FORM" price="68.000đ" height="h-full" />
            </div>

            {/* Cột 2 (Ảnh to ở giữa chiếm 2 hàng) */}
            <div className="md:col-span-1 row-span-2 hidden md:block">
              <div className="w-full h-full bg-white relative group overflow-hidden cursor-pointer shadow-sm">
                <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" alt="Center" className="w-full h-[70%] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-[60%] left-0 w-full h-[40%] bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end items-center pb-8 text-white">
                  <h4 className="font-bold uppercase tracking-wider mb-2 text-lg">DÙ MỎNG NHẸ</h4>
                  <span className="text-xl font-bold">61.000đ</span>
                </div>
              </div>
            </div>

            {/* Cột 3 & 4 (Các ảnh nhỏ còn lại) */}
            <div className="flex flex-col gap-4 md:gap-6">
              <AccessoryCard img="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80" title="DÙ LỖ LAZER" price="103.000đ" />
              <div className="flex gap-4 md:gap-6 h-full">
                <AccessoryCard img="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80" title="GẤP GỌN" price="103.000đ" flex={1} />
                <AccessoryCard img="https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&q=80" title="KAKI MỀM" price="103.000đ" flex={1} />
              </div>
            </div>

            <div className="hidden md:block">
              <AccessoryCard img="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80" title="BỀN BỈ" price="103.000đ" height="h-[100%]" />
            </div>

          </div>

          <div className="text-center mt-12">
            <button className="px-10 py-3 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer">
              XEM TẤT CẢ NÓN
            </button>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 5: SEO & ABOUT (Hình 9)            */}
      {/* ========================================== */}
      <section className="max-w-[1200px] mx-auto px-4 py-24 text-left border-t border-gray-200 mt-12">
        <h4 className="text-base md:text-lg font-semibold mb-6 uppercase text-gray-900 tracking-wide">
          {BRAND.NAME} – TRANG PHỤC NAM BỀN, MỀM, KHÔNG LỖI MỐT | THỜI TRANG NAM VIỆT NAM
        </h4>
        <div className="text-[14px] text-gray-600 space-y-4 leading-relaxed max-w-5xl">
          <p>{BRAND.NAME} là thương hiệu thời trang nam Việt Nam với triết lý <strong className="text-gray-900">"Vị Nhân Sinh": Mặc Bền – Mặc Mềm – Mặc Không Lỗi Mốt.</strong></p>
          <p>Sau hơn 15 năm phát triển, {BRAND.NAME} tập trung mang đến những món đồ chất lượng cao, được thiết kế riêng cho vóc dáng và khí hậu nóng ẩm của đàn ông Việt, giúp bạn tự tin, thoải mái và toát lên khí chất nam tính trưởng thành.</p>

          <p className="font-bold text-gray-900 mt-8 mb-2">Tại sao nên chọn {BRAND.NAME}?</p>
          <ul className="list-none p-0 m-0 space-y-2">
            <li>- Mặc Bền: Vải cao cấp chịu mài mòn tốt, giữ màu lâu (đặc biệt dòng Tek Black), giặt nhiều lần vẫn giữ form.</li>
            <li>- Mặc Mềm: Công nghệ CloudTouch™, IceVibes™ giảm nhiệt 3-7°C, AirDry™ khô nhanh, StayFresh™ khử mùi – cực kỳ phù hợp mặc cả ngày dài dưới nắng Sài Gòn.</li>
            <li>- Mặc Không Lỗi Mốt: Thiết kế tinh giản, phom dáng kinh điển, neutral tones dễ phối đồ.</li>
          </ul>

          {/* ========================================================= */}
          {/* PHẦN NỘI DUNG ẨN: Chỉ hiện ra khi isExpanded === true      */}
          {/* ========================================================= */}
          {isExpanded && (
            <div className="animate-fade-in space-y-4 mt-6">
              <p className="font-bold text-gray-900 mt-8 mb-2">Điểm khác biệt lớn nhất</p>
              <p>Hệ thống mã dáng F1-F5 độc quyền: Chỉ cần tìm đúng một mã dáng phù hợp (F1 ôm sát → F5 siêu rộng), mọi sản phẩm sau (áo thun, polo, quần jean, kaki, khoác...) đều mặc vừa như đúc. Giảm thiểu sai size khi mua online.</p>

              <p className="font-bold text-gray-900 mt-8 mb-2">Sản phẩm nổi bật</p>
              <ul className="list-none p-0 m-0 space-y-2">
                <li>- Áo thun AirDry™, FlexFit™, IceVibes™ (từ 67k)</li>
                <li>- Áo Polo ColorLock™ giữ màu, ít nhăn</li>
                <li>- Quần Jean Tek Black, quần Tây EasyCare™</li>
                <li>- Áo khoác Parka RainShield™ trượt nước</li>
                <li>- Phụ kiện: Nón Dad Hat, balo chống nước, dây nịt da bò, găng tay chống nắng</li>
              </ul>

              <p className="font-bold text-gray-900 mt-8 mb-2">Chính sách mua sắm tốt nhất</p>
              <ul className="list-none p-0 m-0 space-y-2">
                <li>- Đổi trả linh hoạt 14 ngày</li>
                <li>- Bảo hành 365 ngày lỗi kỹ thuật (không cần hóa đơn)</li>
                <li>- Hơn 40 cửa hàng tại TP.HCM và các tỉnh miền Nam</li>
                <li>- Ưu đãi thường xuyên, miễn phí vận chuyển (freeship) cho đơn hàng từ 50.000đ.</li>
              </ul>

              <p className="font-bold text-gray-900 mt-8 mb-2">Unilov</p>
              <p>Không chỉ là quần áo, {BRAND.NAME} là người bạn đồng hành giúp đàn ông Việt mặc sướng, mặc bền và mặc đúng gu mỗi ngày.</p>

              <p className="mt-8">Tìm kiếm: quần áo nam chất lượng cao, áo thun nam mát lạnh, quần jeans nam bền đẹp, thời trang nam công sở, đồ thể thao nam, áo polo nam giá tốt... đều có tại {BRAND.NAME}.</p>

              <p>Ghé ngay <strong className="text-gray-900">{BRAND.NAME}</strong> hoặc cửa hàng gần nhất để trải nghiệm!</p>
            </div>
          )}

          {/* NÚT BẤM ĐIỀU KHIỂN */}
          <div className="text-center mt-10 pt-6 border-t border-gray-100">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold border-none bg-transparent flex items-center justify-center gap-1 mx-auto cursor-pointer  text-gray-900"
            >
              {isExpanded ? 'Thu gọn ^' : 'Xem thêm v'}
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}

function CampaignBlock({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState(data.tabs[0]);

  return (
    <section className="w-full mt-2 bg-[rgba(215, 222, 241, 1)]">
      {/* Banner */}
      <div className="relative w-full h-[40vh] md:h-[65vh]">
        <img src={data.banner_url} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white">
          <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase mb-2">BỀN . MỀM . KHÔNG LỖI MỐT</p>
          <h2 className="text-3xl md:text-5xl font-light mb-4 uppercase tracking-wider">{data.title}</h2>
          <p className="text-xs md:text-sm font-light max-w-2xl text-center px-4 leading-relaxed opacity-90">{data.subtitle}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-14">
          {data.tabs.map((tab: string) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 md:px-6 py-2 md:py-2.5 text-[11px] md:text-[13px] rounded-full border transition-all cursor-pointer ${activeTab === tab
                  ? 'bg-black text-white border-black font-semibold shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {data.products.map((prod: any) => (
            <div key={prod.product_id} className="group cursor-pointer">
              <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                <img src={prod.thumbnail_url} alt={prod.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h4 className="text-[13px] font-medium text-gray-800 leading-snug mb-2 group-hover:text-black">{prod.product_name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-black">{prod.price_range}</span>
                <span className="text-[11px] text-gray-400 line-through">457.000đ</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-10 py-3 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer">
            XEM TẤT CẢ
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// COMPONENT CARD CHO PHỤ KIỆN BENTO BOX
// ---------------------------------------------------------
function AccessoryCard({ img, title, price, height = "h-[220px]", flex }: any) {
  return (
    <div className={`w-full bg-white shadow-sm overflow-hidden group cursor-pointer relative ${height} ${flex ? 'flex-1' : ''}`}>
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      {/* Lớp phủ đen dưới chân thẻ ảnh */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-4 flex flex-col items-center text-white">
        <h5 className="text-[11px] font-bold uppercase tracking-wider mb-1">{title}</h5>
        <span className="text-[14px] font-bold">{price}</span>
        {/* Fake swatches màu */}
        <div className="flex gap-1 mt-2">
          <div className="w-2 h-2 rounded-full bg-white opacity-80" />
          <div className="w-2 h-2 rounded-full bg-gray-400 opacity-80" />
          <div className="w-2 h-2 rounded-full bg-gray-800 opacity-80" />
        </div>
      </div>
    </div>
  );
}