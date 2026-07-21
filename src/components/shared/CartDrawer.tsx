import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, X, ArrowRight } from '@/components/ui/icons';
import { useCart } from '@/hooks/useCart';
import { paths } from '@/config/paths';
import { formatVND, translateAttribute } from '@/utils/formatters';
import { useState, useEffect } from 'react';
import ConfirmModal from '@/components/general/ConfirmModal';
import { toast } from 'react-toastify';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items: cartItems, updateQuantity, removeItem } = useCart();

  // Confirm delete states
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end animate-fade-in">
      <div className="w-80 md:w-[400px] h-full bg-white dark:bg-gray-900 flex flex-col justify-between animate-slide-up shadow-2xl animate-duration-300">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-unilo-border dark:border-gray-800 flex justify-between items-center text-xs uppercase font-bold tracking-wider">
          <span className="font-heading text-theme text-sm flex items-center gap-2">
            <ShoppingCart className="w-4.5 h-4.5" /> Giỏ hàng ({totalQuantity})
          </span>

          <button onClick={onClose} className="p-1 hover:text-theme dark:hover:bg-gray-800 rounded-full border-none bg-transparent cursor-pointer text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content items list */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-xs">
              <p className="text-gray-400 font-light">Giỏ hàng của bạn hiện đang trống.</p>
              <button onClick={onClose} className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg border-none hover:opacity-90 cursor-pointer transition-opacity">
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartDrawerItem
                key={item.id}
                item={item}
                handleUpdateQuantity={handleUpdateQuantity}
                handleRequestRemove={handleRequestRemove}
              />
            ))
          )}
        </div>

        {/* Footer calculations */}
        {cartItems.length > 0 && (
          <div className="p-4 md:p-6 border-t border-unilo-border dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-center text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500">
              <span>Tạm tính</span>
              <span className="text-primary dark:text-white">
                {formatVND(cartSubtotal)}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate(paths.customer.checkout, { 
                  state: { selectedItemIds: cartItems.map(i => i.id) } 
                });
              }}
              className="w-full py-3 text-white bg-theme hover:bg-theme-hover font-bold rounded-xl text-xs md:text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              Thanh toán ngay <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <Link
              to={paths.customer.cart}
              onClick={onClose}
              className="block text-center text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-theme decoration-none transition-colors"
            >
              Xem giỏ hàng chi tiết
            </Link>
          </div>
        )}
      </div>

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

const CartDrawerItem = ({ item, handleUpdateQuantity, handleRequestRemove }: any) => {
  const [quantityInput, setQuantityInput] = useState<string>(String(item.quantity));

  useEffect(() => {
    setQuantityInput(String(item.quantity));
  }, [item.quantity]);

  return (
    <div className="flex gap-3 items-center text-xs border-b border-unilo-border dark:border-gray-850 pb-3 text-left transition-all duration-300">
      <img src={item.variantImage} alt={item.name} className="w-12 h-16 object-cover rounded-lg shrink-0" />
      <div className="min-w-0 flex-1">
        <h4 className="font-heading font-bold text-gray-955 dark:text-white truncate m-0 leading-tight">
          {item.name}
        </h4>
        {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 && (
          <div className="text-[10px] text-gray-400 mt-1 flex flex-wrap gap-x-2">
            {Object.entries(item.variantAttributes).map(([k, v]) => (
              <span key={k}>{translateAttribute(k)}: {String(v)}</span>
            ))}
          </div>
        )}
        <div className="text-gray-400 font-semibold mt-1">
          {formatVND(item.price)}
        </div>
        {/* Quantity modifiers in drawer */}
        <div className="flex items-center gap-2 border border-unilo-border dark:border-gray-800 w-fit rounded overflow-hidden bg-unilo-muted dark:bg-gray-855 mt-2 shrink-0">
          <button
            onClick={() => {
              const currentQty = parseInt(quantityInput) || 1;
              const newQty = Math.max(1, currentQty - 1);
              setQuantityInput(String(newQty));
              handleUpdateQuantity(item.id, newQty);
            }}
            className="px-1.5 py-0.5 hover:text-theme bg-transparent border-none cursor-pointer font-bold transition-colors"
          >
            -
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
                  handleUpdateQuantity(item.id, 1);
                } else if (val < 1) {
                  toast.error("Số lượng tối thiểu là 1.");
                  setQuantityInput("1");
                  handleUpdateQuantity(item.id, 1);
                } else if (val > maxQty) {
                  toast.error(`Chỉ được mua tối đa ${maxQty} sản phẩm.`);
                  setQuantityInput(String(maxQty));
                  handleUpdateQuantity(item.id, maxQty);
                } else {
                  setQuantityInput(String(val));
                  handleUpdateQuantity(item.id, val);
                }
              }
            }}
            onBlur={() => {
              let val = parseInt(quantityInput);
              const maxQty = item.stockQuantity || 9999;
              if (isNaN(val) || quantityInput === '') {
                toast.error("Số lượng không được để trống.");
                setQuantityInput("1");
                handleUpdateQuantity(item.id, 1);
              } else if (val < 1) {
                toast.error("Số lượng tối thiểu là 1.");
                setQuantityInput("1");
                handleUpdateQuantity(item.id, 1);
              } else if (val > maxQty) {
                toast.error(`Chỉ được mua tối đa ${maxQty} sản phẩm.`);
                setQuantityInput(String(maxQty));
                handleUpdateQuantity(item.id, maxQty);
              } else {
                setQuantityInput(String(val));
                handleUpdateQuantity(item.id, val);
              }
            }}
            className="w-8 text-center font-bold text-[10px] bg-transparent border-none focus:outline-none hide-spin-button"
          />
          <button
            onClick={() => {
              const currentQty = parseInt(quantityInput) || 1;
              const maxQty = item.stockQuantity || 9999;
              if (currentQty >= maxQty) {
                toast.error(`Chỉ được mua tối đa ${maxQty} sản phẩm.`);
                setQuantityInput(String(maxQty));
                handleUpdateQuantity(item.id, maxQty);
              } else {
                setQuantityInput(String(currentQty + 1));
                handleUpdateQuantity(item.id, currentQty + 1);
              }
            }}
            className="px-1.5 py-0.5 hover:text-theme bg-transparent border-none cursor-pointer font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right shrink-0 min-w-16">
        <span className="font-bold text-gray-955 dark:text-white block">
          {formatVND(item.price * item.quantity)}
        </span>
        <button
          onClick={() => handleRequestRemove(item.id)}
          className="text-[10px] text-gray-400 hover:text-cancel font-semibold border-none bg-transparent cursor-pointer mt-1 transition-colors"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
