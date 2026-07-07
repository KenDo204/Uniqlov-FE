import React from 'react';
import { Star } from '@/components/ui/icons';
import { formatVND } from '@/utils/formatters';

interface CrossSellSectionProps {
  crossSellItems: any[];
}

export const CrossSellSection: React.FC<CrossSellSectionProps> = ({ crossSellItems }) => {
  if (crossSellItems.length === 0) return null;

  return (
    <div id="recommendations-section" className="mt-24 pt-12 border-t border-gray-200 scroll-mt-24">
      <h3 className="text-[18px] font-medium mb-6">Sản Phẩm Gợi Ý Theo Giỏ Hàng</h3>

      {/* Lưới sản phẩm không viền */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {crossSellItems.map((prod) => (
          <div key={prod.product_id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
              <img
                src={prod.images[0]?.image_url}
                alt={prod.product_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Swatches màu */}
            <div className="flex gap-1.5 mb-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#3c4146] border border-gray-300" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#1b344c] border border-gray-300" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#d0c9b9] border border-gray-300" />
            </div>

            {/* Chi tiết */}
            <div className="space-y-1">
              <div className="text-[11px] text-gray-500 uppercase tracking-wide">Nam, XS-XXL</div>
              <h4 className="text-[14px] font-medium text-gray-900 m-0 leading-snug">
                {prod.product_name}
              </h4>
              <div className="text-[16px] font-bold text-gray-900 pt-1">
                {formatVND(prod.variants[0]?.price || 0)}
              </div>
              <div className="text-[11px] text-gray-500">Sản phẩm được làm từ chất liệu tái chế</div>

              {/* Đánh giá sao */}
              <div className="flex items-center gap-1 pt-1">
                <Star className="w-3 h-3 fill-black text-black" />
                <span className="text-[12px] font-bold">4.8</span>
                <span className="text-[11px] text-gray-400">(140)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
