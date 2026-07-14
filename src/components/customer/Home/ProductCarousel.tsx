import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/shared/ProductCard";
import type { ProductResponse } from "@/types/product/responses";
import { Source } from "@/types/tracking/requests";

interface ProductCarouselProps {
  title: string;
  products: ProductResponse[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  return (
    <section className="py-6 md:py-10">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-wide">{title}</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.productId} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <ProductCard product={product} source={Source.HOME_REC_FOR_YOU} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden xl:flex -left-12 bg-white hover:bg-gray-100 border-border-base h-12 w-12" />
          <CarouselNext className="hidden xl:flex -right-12 bg-white hover:bg-gray-100 border-border-base h-12 w-12" />
        </Carousel>
      </div>
    </section>
  );
}
