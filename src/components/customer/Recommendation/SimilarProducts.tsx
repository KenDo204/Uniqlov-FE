import { ProductGrid } from '@/components/shared/ProductGrid';
import { useSimilarProducts } from '@/hooks/useRecommendation';
import { Source } from '@/types/tracking/requests';

interface SimilarProductsProps {
  productId: number;
}

export function SimilarProducts({ productId }: SimilarProductsProps) {
  const { data: similarProducts = [], isLoading, isError } = useSimilarProducts(productId);

  if (!isLoading && (isError || !similarProducts || similarProducts.length === 0)) {
    return null;
  }

  return (
    <div className="mt-16 w-full">
      <h3 className="text-xl md:text-2xl font-heading font-black text-center mb-8 uppercase tracking-tight text-gray-900">
        Sản phẩm tương tự
      </h3>

      <ProductGrid
        products={similarProducts}
        isLoading={isLoading}
        skeletonCount={4}
        gridClassName="grid-cols-2 lg:grid-cols-4"
        source={Source.PRODUCT_REC_SIMILAR}
        isRecommendation={true}
        aiModel="similar_v1"
        emptyContent={<></>}
      />
    </div>
  );
}

