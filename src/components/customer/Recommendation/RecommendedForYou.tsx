import { useEffect } from 'react';
import { ProductSwiper } from '@/components/shared/ProductSwiper';
import { useRecommendation } from '@/hooks/useRecommendation';
import { Source } from '@/types/tracking/requests';
import { Container } from '@/components/shared/Container';

export function RecommendedForYou() {
  const { recommendedForYou, isFetching, fetchRecommendedForYou } = useRecommendation();

  useEffect(() => {
    fetchRecommendedForYou(10).catch(console.error);
  }, [fetchRecommendedForYou]);

  if (!isFetching && (!recommendedForYou || recommendedForYou.length === 0)) {
    return null; // Không hiển thị section nếu không có dữ liệu
  }

  return (
    <section className="w-full py-8 md:py-16 bg-white">
      <Container>
        <h2 className="text-2xl md:text-3xl font-heading font-black text-center mb-8 md:mb-12 m-0 uppercase tracking-tight text-gray-900">
          Gợi ý dành riêng cho bạn
        </h2>

        <ProductSwiper
          products={recommendedForYou}
          isLoading={isFetching}
          skeletonCount={5}
          // Truyền flag để ProductCard biết đây là item từ AI Recommendation (để gọi sự kiện CLICK_REC)
          source={Source.HOME_REC_FOR_YOU}
          isRecommendation={true}
          aiModel="for_you_v1"
          emptyContent={<></>}
        />
      </Container>
    </section>
  );
}
