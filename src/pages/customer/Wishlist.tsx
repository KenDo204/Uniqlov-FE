import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { mockProducts } from '../../features/products';
import { useCartStore } from '../../stores/useCartStore';
import { paths } from '../../config/paths';
import { toast } from 'react-toastify';

export function Wishlist() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  // For mock simulation, we take first 2 products from mock catalog as saved items
  const savedItems = mockProducts.slice(1, 3);

  const handleMoveToCart = (product: typeof mockProducts[0]) => {
    const firstVar = product.variants[0];
    const size = firstVar?.sizes.find(s => s.inventory > 0)?.size || 'M';
    const color = firstVar?.colorName || 'Default';

    addItem({
      id: `${product.id}-${color}-${size}`,
      name: `${product.name} (${color} / ${size})`,
      price: product.price,
      image: firstVar?.images[0] || ''
    }, 1);

    toast.success(`Moved ${product.name} to cart.`);
  };

  return (
    <div className="space-y-8 text-left bg-unilo-muted min-h-screen pb-12">
      <h1 className="text-3xl font-heading font-black m-0 border-b border-unilo-border dark:border-gray-800 pb-4 flex items-center gap-2">
        <Heart className="w-6 h-6 text-accent fill-accent" /> Saved Items Wishlist
      </h1>

      {savedItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-16 rounded-2xl text-center space-y-4">
          <p className="text-gray-400 font-light text-base">You haven’t saved any items yet.</p>
          <button
            onClick={() => navigate(paths.customer.men)}
            className="btn-primary border-none cursor-pointer text-xs"
          >
            Browse Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedItems.map((product) => {
            const firstVar = product.variants[0];
            return (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-all text-xs"
              >
                <div className="h-64 bg-unilo-muted dark:bg-gray-800 overflow-hidden relative">
                  <img
                    src={firstVar?.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => navigate(paths.customer.productDetail.replace(':id', product.id))}
                  />
                  <button
                    onClick={() => toast.success('Removed from saved list.')}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white dark:bg-black/40 backdrop-blur rounded-full text-gray-500 hover:text-red-500 border-none cursor-pointer shadow-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-accent">{product.category}</span>
                    <h4
                      onClick={() => navigate(paths.customer.productDetail.replace(':id', product.id))}
                      className="font-heading font-bold text-sm text-gray-900 dark:text-white truncate m-0 cursor-pointer hover:text-accent transition-colors"
                    >
                      {product.name}
                    </h4>
                    <span className="font-bold text-sm block">${(product.price / 23000).toFixed(0)} USD</span>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 bg-primary text-white font-bold rounded-lg border-none hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
