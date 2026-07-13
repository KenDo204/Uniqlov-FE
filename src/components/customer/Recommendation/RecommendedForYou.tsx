import { useEffect } from 'react';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { useRecommendation } from '@/hooks/useRecommendation';

export function RecommendedForYou() {
  const { recommendedForYou, isFetching, fetchRecommendedForYou } = useRecommendation();

  useEffect(() => {
    fetchRecommendedForYou(8).catch(console.error);
  }, [fetchRecommendedForYou]);

  if (!isFetching && (!recommendedForYou || recommendedForYou.length === 0)) {
    return null; // Không hiển thị section nếu không có dữ liệu
  }

  return (
    <section className="w-full py-8 md:py-16 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-heading font-black text-center mb-8 md:mb-12 m-0 uppercase tracking-tight text-gray-900">
          Gợi ý dành riêng cho bạn
        </h2>

        <ProductGrid
          products={recommendedForYou}
          isLoading={isFetching}
          skeletonCount={4}
          gridClassName="grid-cols-2 lg:grid-cols-4"
          // Truyền flag để ProductCard biết đây là item từ AI Recommendation (để gọi sự kiện CLICK_REC)
          isRecommendation={true}
          aiModel="for_you_v1"
          emptyContent={<></>}
        />
      </div>
    </section>
  );
}
