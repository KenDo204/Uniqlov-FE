import { useState } from 'react';

interface CampaignSectionProps {
  campaignBlocks: any[];
}

export function CampaignSection({ campaignBlocks }: CampaignSectionProps) {
  return (
    <>
      {campaignBlocks.map((campaign) => (
        <CampaignBlock key={campaign.id} data={campaign} />
      ))}
    </>
  );
}

function CampaignBlock({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState(data.tabs[0]);

  return (
    <section className="w-full mt-2 bg-[rgba(215, 222, 241, 1)]">
      {/* Banner */}
      <div className="relative w-full h-[40vh] md:h-[65vh]">
        <img src={data.banner_url} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white">
          <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase mb-2">BỀN . MỀM . KHÔNG LỖI MỐT</p>
          <h2 className="text-3xl md:text-5xl font-light mb-4 uppercase tracking-wider">{data.title}</h2>
          <p className="text-xs md:text-sm font-light max-w-2xl text-center px-4 leading-relaxed opacity-90">{data.subtitle}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-14">
          {data.tabs.map((tab: string) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 md:px-6 py-2 md:py-2.5 text-[11px] md:text-[13px] rounded-full border transition-all cursor-pointer ${activeTab === tab
                  ? 'bg-black text-white border-black font-semibold shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {data.products.map((prod: any) => (
            <div key={prod.product_id} className="group cursor-pointer">
              <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
                <img src={prod.thumbnail_url} alt={prod.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h4 className="text-[13px] font-medium text-gray-800 leading-snug mb-2 group-hover:text-black">{prod.product_name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-black">{prod.price_range}</span>
                <span className="text-[11px] text-gray-400 line-through">457.000đ</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-10 py-3 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer">
            XEM TẤT CẢ
          </button>
        </div>
      </div>
    </section>
  );
}
