
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
import { FloatingContactWidget } from '@/components/shared/FloatingContactWidget';
import { mockDataHome } from '@/constants/mock-data-home';

export function Home() {
  const data = mockDataHome.data;

  if (!data) return null;

  return (
    <>
      <div className="w-full text-left bg-white pb-20">
        {/* SECTION 1: HERO */}
        <HeroBanner />
        
        {/* SECTION: CATEGORIES */}
        <CategorySection />

        {/* SECTION 3: BEST SELLERS */}
        <BestSellers />

        {/* SECTION 4: POPULAR */}
        <Popular />

        {/* SECTION 5: NEW ARRIVALS */}
        <NewArrivals />

        {/* SECTION: CAMPAIGNS */}
        <CampaignSection campaignBlocks={data.campaignBlocks} />

        {/* SECTION: ACCESSORIES */}
        <AccessorySection />

        {/* SECTION: ABOUT & SEO */}
        <AboutSection />
      </div>

      <FloatingContactWidget />
    </>
  );
}