import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Minus, Heart } from '@/components/ui/icons';
import { formatVND, translateAttribute } from '@/utils/formatters';
import { toast } from 'react-toastify';
import type { CartItem } from '@/stores/slices/cartSlice';
import { paths } from '@/config/paths';
import { useProduct } from '@/hooks/useProduct';

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: (id: string, selected: boolean) => void;
  onUpdateQuantity: (id: string, quantity: number, note?: string) => void;
  onRemoveItem: (id: string) => void;
  onOpenVariantModal: (item: CartItem) => void;
}


export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemoveItem,
  onOpenVariantModal,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchPublicProductById } = useProduct();
  const [productSlug, setProductSlug] = useState<string>();
  const [quantityInput, setQuantityInput] = useState<string>(String(item.quantity));
  const [noteInput, setNoteInput] = useState<string>(item.note || '');

  useEffect(() => {
    setQuantityInput(String(item.quantity));
  }, [item.quantity]);

  useEffect(() => {
    setNoteInput(item.note || '');
  }, [item.note]);

  useEffect(() => {
    const slug = (item as any).productSlug;
    if (item.productId && !slug) {
      fetchPublicProductById(item.productId)
        .then((res) => {
          if (res && res.productSlug) {
            setProductSlug(res.productSlug);
          }
        })
        .catch((err) => {
          console.error("Error fetching product slug", err);
        });
    } else if (slug) {
      setProductSlug(slug);
    }
  }, [item.productId, (item as any).productSlug, fetchPublicProductById]);

  const handleProductClick = () => {
    const productUrl = paths.customer.productDetail.replace(
      ':id',
      productSlug || String(item.productId)
    );
    navigate(productUrl, {
      state: { from: location.pathname + location.search },
    });
  };

  return (
    <div className="py-6 border-b border-gray-200 flex gap-4 md:gap-6">
      {/* Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onToggleSelect(item.id, e.target.checked)}
          className="w-5 h-5 accent-theme cursor-pointer"
        />
      </div>

      {/* Hình ảnh to, vuông vức */}
      <div 
        className="w-[120px] h-[150px] md:w-[150px] md:h-[180px] shrink-0 bg-gray-50 cursor-pointer"
        onClick={handleProductClick}
      >
        <img src={item.variantImage} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-medium text-[15px] md:text-[16px] m-0 leading-snug">
            <span 
              onClick={handleProductClick} 
              className="text-gray-900 hover:text-theme cursor-pointer"
            >
              {item.name}
            </span>
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

        <div className="mt-3 flex flex-col max-w-sm">
          <label className="text-[12px] text-gray-500 mb-1">Ghi chú (Tùy chọn):</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="VD: Ít đá, giao tối..."
              className="flex-1 px-3 py-1.5 text-[13px] border border-gray-200 rounded-[4px] focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdateQuantity(item.id, item.quantity, noteInput);
                }
              }}
              onBlur={() => {
                if (noteInput !== (item.note || '')) {
                  onUpdateQuantity(item.id, item.quantity, noteInput);
                }
              }}
            />
          </div>
        </div>

        <div className="text-[16px] font-bold mt-3 text-theme">{formatVND(item.price)}</div>

        {/* Bộ tăng giảm số lượng & Xóa */}
        <div className="mt-5 flex flex-col items-start gap-2">
          <div className="flex items-center bg-[#f4f4f4] rounded-[4px]">
            <button
              onClick={() => {
                const currentQty = parseInt(quantityInput) || 1;
                const newQty = Math.max(1, currentQty - 1);
                setQuantityInput(String(newQty));
                onUpdateQuantity(item.id, newQty, noteInput);
              }}
              className="px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-200 bg-transparent border-none cursor-pointer"
            >
              <Minus className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <input
              type="text"
              value={quantityInput}
              onChange={(e) => {
                setQuantityInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  let val = parseInt(quantityInput);
                  const maxQty = item.stockQuantity || 9999;
                  if (isNaN(val) || quantityInput === '') {
                    toast.error("Số lượng không được để trống.");
                    setQuantityInput("1");
                    onUpdateQuantity(item.id, 1, noteInput);
                  } else if (val < 1) {
                    toast.error("Số lượng tối thiểu là 1.");
                    setQuantityInput("1");
                    onUpdateQuantity(item.id, 1, noteInput);
                  } else if (val > maxQty) {
                    toast.error(`Chỉ được mua tối đa ${maxQty} sản phẩm.`);
                    setQuantityInput(String(maxQty));
                    onUpdateQuantity(item.id, maxQty, noteInput);
                  } else {
                    setQuantityInput(String(val));
                    onUpdateQuantity(item.id, val, noteInput);
                  }
                }
              }}
              onBlur={() => {
                let val = parseInt(quantityInput);
                const maxQty = item.stockQuantity || 9999;
                if (isNaN(val) || quantityInput === '') {
                  toast.error("Số lượng không được để trống.");
                  setQuantityInput("1");
                  onUpdateQuantity(item.id, 1, noteInput);
                } else if (val < 1) {
                  toast.error("Số lượng tối thiểu là 1.");
                  setQuantityInput("1");
                  onUpdateQuantity(item.id, 1, noteInput);
                } else if (val > maxQty) {
                  toast.error(`Chỉ được mua tối đa ${maxQty} sản phẩm.`);
                  setQuantityInput(String(maxQty));
                  onUpdateQuantity(item.id, maxQty, noteInput);
                } else {
                  setQuantityInput(String(val));
                  if (val !== item.quantity) {
                    onUpdateQuantity(item.id, val, noteInput);
                  }
                }
              }}
              className="w-12 text-center text-[14px] font-medium bg-transparent border-none focus:outline-none hide-spin-button"
            />
            <button
              onClick={() => {
                const currentQty = parseInt(quantityInput) || 1;
                const maxQty = item.stockQuantity || 9999;
                if (currentQty >= maxQty) {
                  toast.error(`Chỉ được mua tối đa ${maxQty} sản phẩm.`);
                  setQuantityInput(String(maxQty));
                  onUpdateQuantity(item.id, maxQty, noteInput);
                } else {
                  setQuantityInput(String(currentQty + 1));
                  onUpdateQuantity(item.id, currentQty + 1, noteInput);
                }
              }}
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
