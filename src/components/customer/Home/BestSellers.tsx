import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '@/components/ui/icons';
import { paths } from '@/config/paths';
import type { Product } from '@/features/products';
import { ProductCard } from '@/components/shared/ProductCard';

interface BestSellersProps {
  products: Product[];
  onAddToCart: (product: Product, e: React.MouseEvent, selectedColor?: string) => void;
}

export function BestSellers({ products, onAddToCart }: BestSellersProps) {
  const navigate = useNavigate();

  // Filter popular products for best sellers
  const bestSellers = products.filter((p) => p.in_popular).slice(0, 8);

  return (
    <section className="space-y-6 max-w-[1400px] mx-auto px-4 lg:px-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-black m-0">Sản phẩm bán chạy nhất</h2>
        </div>
        <button
          onClick={() => navigate(paths.customer.bestSellers)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent border-none bg-transparent cursor-pointer "
        >
          Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
