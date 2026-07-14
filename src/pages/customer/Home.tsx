
import {
  HeroBanner,
  BestSellers,
  NewArrivals,
  Popular,
  CategorySection,
  CampaignSection,
  AccessorySection,
  AboutSection,
} from '@/components/customer/Home';
import { RecommendedForYou } from '@/components/customer/Recommendation/RecommendedForYou';
import { FloatingContactWidget } from '@/components/shared/FloatingContactWidget';
export function Home() {
  return (
    <>
      <div className="w-full text-left bg-white pb-20">
        {/* SECTION 1: HERO */}
        <HeroBanner />
 
        {/* SECTION: RECOMMENDED FOR YOU */}
        <RecommendedForYou />
        
        {/* SECTION: CATEGORIES */}
        <CategorySection />

        {/* SECTION 3: BEST SELLERS */}
        <BestSellers />

        {/* SECTION 4: POPULAR */}
        <Popular />

        {/* SECTION 5: NEW ARRIVALS */}
        <NewArrivals />

        {/* SECTION: CAMPAIGNS */}
        <CampaignSection />

        {/* SECTION: ACCESSORIES */}
        <AccessorySection />

        {/* SECTION: ABOUT & SEO */}
        <AboutSection />
      </div>

      <FloatingContactWidget />
    </>
  );
}