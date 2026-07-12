import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Heart } from '@/components/ui/icons';
import { formatVND, translateAttribute } from '@/utils/formatters';
import type { CartItem } from '@/stores/slices/cartSlice';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenVariantModal: (item: CartItem) => void;
}


export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onOpenVariantModal,
}) => {
  return (
    <div className="py-6 border-b border-gray-200 flex gap-4 md:gap-6">
      {/* Hình ảnh to, vuông vức */}
      <div className="w-[120px] h-[150px] md:w-[150px] md:h-[180px] shrink-0 bg-gray-50">
        <Link to={`/product/${item.id}`}>
          <img src={item.variantImage} alt={item.name} className="w-full h-full object-cover" />
        </Link>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-medium text-[15px] md:text-[16px] m-0 leading-snug">
            <Link to={`/product/${item.id}`} className="text-gray-900 hover:text-theme no-underline">
              {item.name}
            </Link>
          </h3>
          <button className="text-gray-400 hover:text-theme bg-transparent border-none cursor-pointer p-0 shrink-0">
            <Heart className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Size & Màu / Thuộc tính sản phẩm */}
        <div className="mt-2 text-left">
          {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 ? (
            <div className="text-[13px] text-gray-600 space-y-1">
              {Object.entries(item.variantAttributes).map(([key, value]) => (
                <div key={key} className="flex gap-1">
                  <span className="text-gray-500">{translateAttribute(key)}:</span>
                  <span className="text-gray-900 font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[13px] text-gray-600 space-y-1">
              {item.color && (
                <div className="flex gap-1">
                  <span className="text-gray-500">Màu sắc:</span>
                  <span className="text-gray-900 font-medium">{item.color}</span>
                </div>
              )}
              {item.size && (
                <div className="flex gap-1">
                  <span className="text-gray-500">Kích thước:</span>
                  <span className="text-gray-900 font-medium">{item.size}</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => onOpenVariantModal(item)}
            className="text-[12px] text-theme font-medium hover:underline mt-1.5 bg-transparent border-none cursor-pointer p-0 inline-flex items-center gap-1"
          >
            Thay đổi phân loại
          </button>
        </div>

        <div className="text-[16px] font-bold mt-3 text-theme">{formatVND(item.price)}</div>

        {/* Bộ tăng giảm số lượng & Xóa */}
        <div className="mt-5 flex flex-col items-start gap-2">
          <div className="flex items-center bg-[#f4f4f4] rounded-[4px]">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-200 bg-transparent border-none cursor-pointer"
            >
              <Minus className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <span className="px-4 py-2 text-[14px] font-medium min-w-[2.5rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-200 bg-transparent border-none cursor-pointer"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          <button
            onClick={() => onRemoveItem(item.id)}
            className="text-cancel text-[15px] border-none bg-transparent cursor-pointer p-0 mt-1 hover:text-cancel-hover"
          >
            Xóa
          </button>

          <div className="text-[14px] mt-2">
            Tổng: <span className="font-bold text-theme">{formatVND(item.price * item.quantity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
