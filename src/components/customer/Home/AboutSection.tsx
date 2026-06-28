import { useState } from 'react';
import { BRAND } from '@/constants/brand';

export function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
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

        <div className="text-center mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold border-none bg-transparent flex items-center justify-center gap-1 mx-auto cursor-pointer text-gray-900"
          >
            {isExpanded ? 'Thu gọn ^' : 'Xem thêm v'}
          </button>
        </div>

      </div>
    </section>
  );
}
