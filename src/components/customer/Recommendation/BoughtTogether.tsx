import { useEffect } from 'react';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { useRecommendation } from '@/hooks/useRecommendation';
import { Source } from '@/types/tracking/requests';

interface BoughtTogetherProps {
  productId: number;
}

export function BoughtTogether({ productId }: BoughtTogetherProps) {
  const { boughtTogether, isFetching, fetchBoughtTogether } = useRecommendation();

  useEffect(() => {
    if (productId) {
      fetchBoughtTogether(productId).catch(console.error);
    }
  }, [productId, fetchBoughtTogether]);

  if (!isFetching && (!boughtTogether || boughtTogether.length === 0)) {
    return null;
  }

  return (
    <div className="mt-16 w-full">
      <h3 className="text-xl md:text-2xl font-heading font-black text-center mb-8 uppercase tracking-tight text-gray-900">
        Thường được mua cùng
      </h3>

      <ProductGrid
        products={boughtTogether}
        isLoading={isFetching}
        skeletonCount={4}
        gridClassName="grid-cols-2 lg:grid-cols-4"
        source={Source.PRODUCT_REC_BOUGHT_TOGETHER}
        isRecommendation={true}
        aiModel="bought_together_v1"
        emptyContent={<></>}
      />
    </div>
  );
}
