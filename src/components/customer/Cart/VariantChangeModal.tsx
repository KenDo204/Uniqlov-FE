import React from 'react';
import { formatVND } from '@/utils/formatters';
import type { CartItem } from '@/stores/slices/cartSlice';
import type { ProductVariantResponse } from '@/types/product';

interface VariantChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCartItem: CartItem | null;
  loadingVariants: boolean;
  matchingVariant: ProductVariantResponse | null;
  attributeKeys: string[];
  attributeValues: Record<string, string[]>;
  tempAttributes: Record<string, string>;
  setTempAttributes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onConfirmVariant: () => void;
}

const translateAttribute = (key: string) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey === 'size') return 'Kích thước';
  if (lowerKey === 'color') return 'Màu sắc';
  return key;
};

export const VariantChangeModal: React.FC<VariantChangeModalProps> = ({
  isOpen,
  onClose,
  selectedCartItem,
  loadingVariants,
  matchingVariant,
  attributeKeys,
  attributeValues,
  tempAttributes,
  setTempAttributes,
  onConfirmVariant,
}) => {
  if (!isOpen || !selectedCartItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-[500px] shadow-xl animate-fade-in text-left">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-150 pb-3">
          <h3 className="text-[18px] font-bold m-0 text-black">Thay đổi phân loại</h3>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[20px] font-light cursor-pointer text-gray-400 hover:text-black"
          >
            ✕
          </button>
        </div>

        {loadingVariants ? (
          <div className="py-12 text-center text-gray-500">Đang tải phân loại sản phẩm...</div>
        ) : (
          <div className="space-y-4">
            {/* Product Info */}
            <div className="flex gap-4 items-start border-b border-gray-150 pb-4">
              <img
                src={matchingVariant?.variantImage || selectedCartItem.variantImage}
                alt={selectedCartItem.name}
                className="w-20 h-24 object-cover bg-gray-50"
              />
              <div className="flex-1">
                <h4 className="font-medium text-[15px] m-0 leading-snug">{selectedCartItem.name}</h4>
                <div className="mt-2 space-y-1">
                  {matchingVariant ? (
                    <>
                      <div className="text-[16px] font-bold text-theme">
                        {formatVND(matchingVariant.price)}
                      </div>
                      <div className="text-[12px] text-gray-600 font-medium">
                        Còn lại:{' '}
                        {matchingVariant.stockQuantity > 0 ? (
                          `${matchingVariant.stockQuantity} sản phẩm`
                        ) : (
                          <span className="text-red-500 font-bold">Hết hàng</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-[13px] text-red-500 font-semibold">
                      Tổ hợp phân loại này không khả dụng.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Attribute Selectors */}
            <div className="space-y-4">
              {attributeKeys.map((key) => (
                <div key={key}>
                  <span className="block text-[13px] font-semibold mb-2 text-gray-700">
                    {translateAttribute(key)}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {attributeValues[key]?.map((val) => {
                      const isSelected = tempAttributes[key] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setTempAttributes((prev) => ({ ...prev, [key]: val }))}
                          className={`px-4 py-2 text-[13px] font-medium border flex items-center justify-center transition-all cursor-pointer bg-white rounded
                                ${
                                  isSelected
                                    ? 'border-theme border-[2px] text-theme font-bold bg-theme/5'
                                    : 'border-gray-300 text-gray-800 hover:border-black'
                                }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Status indicator / warnings */}
            {matchingVariant && matchingVariant.stockQuantity <= 0 && (
              <div className="p-3 bg-red-50 text-red-700 text-[13px] rounded font-medium">
                Sản phẩm với phân loại này đã hết hàng. Vui lòng chọn phân loại khác.
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-150 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-full text-[13px] font-bold bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={onConfirmVariant}
                disabled={!matchingVariant || matchingVariant.stockQuantity <= 0}
                className="px-6 py-2 rounded-full text-[13px] font-bold bg-theme hover:bg-theme-hover text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
