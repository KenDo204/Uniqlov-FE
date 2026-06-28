import { mockCategories } from '@/constants/mock-categories';

export function CategorySection() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
      <h3 className="text-xl md:text-2xl font-medium text-center mb-12">Tìm theo danh mục</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-4">
        {mockCategories[0].items.slice(0, 6).map((cat) => (
          <div key={cat.category_id} className="flex flex-col items-center group cursor-pointer text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 mb-4 transition-transform duration-300 group-hover:-translate-y-2">
              <img src={cat.icon_url} alt={cat.category_name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <span className="text-[11px] md:text-xs font-medium uppercase text-gray-700 group-hover:text-black tracking-wide leading-snug">
              {cat.category_name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
