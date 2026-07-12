import React, { useState, useMemo } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { mockProducts } from '@/features/products';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/stores/hooks';
import { useCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProduct';
import BackHome from '@/components/general/BackHomeButton';
import type { CartItem } from '@/stores/slices/cartSlice';
import type { ProductVariantResponse } from '@/types/product';

import { CartItemRow } from '@/components/customer/Cart/CartItemRow';
import { OrderSummary } from '@/components/customer/Cart/OrderSummary';
import { CrossSellSection } from '@/components/customer/Cart/CrossSellSection';
import { VariantChangeModal } from '@/components/customer/Cart/VariantChangeModal';
import ConfirmModal from '@/components/general/ConfirmModal';

export function Cart() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const { fetchCart, changeVariant } = useCart();
  const { fetchProductVariants, products, fetchPublicProducts } = useProduct();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // States for changing variants
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [itemVariants, setItemVariants] = useState<ProductVariantResponse[]>([]);
  const [tempAttributes, setTempAttributes] = useState<Record<string, string>>({});

  // Confirm delete states
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const scrollToRecommendations = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('recommendations-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fetch cart if authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  React.useEffect(() => {
    if (products.length === 0) {
      fetchPublicProducts().catch((err) => {
        console.error('Error fetching public products:', err);
      });
    }
  }, [products.length, fetchPublicProducts]);

  // Extract attribute keys from variants
  const attributeKeys = useMemo(() => {
    if (itemVariants.length === 0) return [];
    const keysSet = new Set<string>();
    itemVariants.forEach((v) => {
      if (v.variantAttributes) {
        Object.keys(v.variantAttributes).forEach((k) => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  }, [itemVariants]);

  // Extract all unique values for each key
  const attributeValues = useMemo(() => {
    const values: Record<string, string[]> = {};
    attributeKeys.forEach((key) => {
      const valsSet = new Set<string>();
      itemVariants.forEach((v) => {
        if (v.variantAttributes && v.variantAttributes[key]) {
          valsSet.add(v.variantAttributes[key]);
        }
      });
      values[key] = Array.from(valsSet);
    });
    return values;
  }, [attributeKeys, itemVariants]);

  // Find variant matching tempAttributes
  const matchingVariant = useMemo(() => {
    if (itemVariants.length === 0) return null;
    return (
      itemVariants.find((v) => {
        return attributeKeys.every((key) => v.variantAttributes?.[key] === tempAttributes[key]);
      }) || null
    );
  }, [itemVariants, tempAttributes, attributeKeys]);

  const handleOpenVariantModal = async (item: CartItem) => {
    setSelectedCartItem(item);
    setIsVariantModalOpen(true);
    setLoadingVariants(true);

    const vId = item.variantId || Number(item.id);
    const product = products.find((p) => p.variants.some((v) => v.variantId === vId));
    if (product) {
      try {
        const variantsData = await fetchProductVariants(product.productId);
        setItemVariants(variantsData || []);

        const initialAttrs: Record<string, string> = {};
        if (item.variantAttributes && Object.keys(item.variantAttributes).length > 0) {
          Object.assign(initialAttrs, item.variantAttributes);
        } else {
          if (item.color) {
            const colorKey =
              variantsData && variantsData.length > 0
                ? Object.keys(variantsData[0].variantAttributes).find(
                    (k) => k.toLowerCase().includes('color') || k.toLowerCase().includes('màu')
                  )
                : null;
            if (colorKey) initialAttrs[colorKey] = item.color;
          }
          if (item.size) {
            const sizeKey =
              variantsData && variantsData.length > 0
                ? Object.keys(variantsData[0].variantAttributes).find(
                    (k) => k.toLowerCase().includes('size') || k.toLowerCase().includes('kích')
                  )
                : null;
            if (sizeKey) initialAttrs[sizeKey] = item.size;
          }
        }
        setTempAttributes(initialAttrs);
      } catch (err) {
        console.error('Failed to fetch variants:', err);
        toast.error('Không thể tải danh sách thuộc tính sản phẩm.');
      } finally {
        setLoadingVariants(false);
      }
    } else {
      toast.error('Không tìm thấy thông tin sản phẩm.');
      setLoadingVariants(false);
      setIsVariantModalOpen(false);
    }
  };

  const handleConfirmVariant = async () => {
    if (!selectedCartItem || !matchingVariant) return;
    try {
      const oldVariantId = selectedCartItem.variantId || Number(selectedCartItem.id);
      await changeVariant(
        oldVariantId,
        matchingVariant,
        selectedCartItem.quantity,
        selectedCartItem.note
      );
      toast.success('Thay đổi phân loại thành công.');
      setIsVariantModalOpen(false);
    } catch (err: any) {
      toast.error(err || 'Không thể cập nhật phân loại sản phẩm.');
    }
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setItemToRemove(id);
      setIsConfirmModalOpen(true);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRequestRemove = (id: string) => {
    setItemToRemove(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove);
      setItemToRemove(null);
    }
    setIsConfirmModalOpen(false);
  };

  const handleCancelRemove = () => {
    setItemToRemove(null);
    setIsConfirmModalOpen(false);
  };

  // Financial calculations
  const rawSubtotal = items.reduce((sum, item) => sum + (typeof item.totalMoney === 'number' ? item.totalMoney : item.price * item.quantity), 0);

  const total = rawSubtotal;

  // Cross-sell recommendations
  const crossSellItems = useMemo(() => {
    return mockProducts
      .filter((p) => !items.some((i) => i.id.startsWith(p.product_id.toString())))
      .slice(0, 4); // Lấy 4 item cho đẹp
  }, [items]);

  const FreeShippingText = () => (
    <div className="text-[14px] mb-8 text-gray-800 leading-relaxed">
      <a
        href="#recommendations-section"
        onClick={scrollToRecommendations}
        className="text-theme decoration-solid cursor-pointer inline-block mt-1"
      >
        Xem những gì được đề xuất cho bạn
      </a>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Tiêu đề & Thông báo vận chuyển */}
        <h1 className="text-[28px] md:text-[32px] font-medium m-0 mb-4 tracking-tight">
          Giỏ hàng
        </h1>
        <FreeShippingText />

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4 border-t border-gray-200">
            <p className="text-gray-500 font-normal text-base">Giỏ hàng của bạn đang trống.</p>
            <div className="flex justify-center">
              <BackHome className="px-8 py-3 !rounded-full text-sm uppercase" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
            {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
            <div className="flex-1 w-full border-t border-gray-200">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRequestRemove}
                  onOpenVariantModal={handleOpenVariantModal}
                />
              ))}
            </div>

            {/* CỘT PHẢI: KHUNG THANH TOÁN (ORDER SUMMARY) */}
            <OrderSummary
              itemCount={items.length}
              rawSubtotal={rawSubtotal}
              total={total}
            />
          </div>
        )}

        {/* GỢI Ý MUA SẮM CROSS-SELL */}
        {crossSellItems.length > 0 && items.length > 0 && (
          <CrossSellSection crossSellItems={crossSellItems} />
        )}
      </div>

      {/* Modal thay đổi phân loại */}
      <VariantChangeModal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        selectedCartItem={selectedCartItem}
        loadingVariants={loadingVariants}
        matchingVariant={matchingVariant}
        attributeKeys={attributeKeys}
        attributeValues={attributeValues}
        tempAttributes={tempAttributes}
        setTempAttributes={setTempAttributes}
        onConfirmVariant={handleConfirmVariant}
      />

      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={handleCancelRemove}
        title="Xóa sản phẩm khỏi giỏ hàng"
        content="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
        onConfirm={handleConfirmRemove}
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </div>
  );
}

export default Cart;