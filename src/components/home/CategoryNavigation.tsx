import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { paths } from '@/config/paths';

export function CategoryNavigation() {
  const navigate = useNavigate();
  return (
    <section className="space-y-6 max-w-[1400px] mx-auto px-4 lg:px-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-black m-0">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { name: 'Men', path: paths.customer.men, img: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=400&q=80' },
          { name: 'Women', path: paths.customer.women, img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80' },
          { name: 'Essentials', path: paths.customer.seasonalEssentials, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80' },
          { name: 'Active', path: paths.customer.newArrivals, img: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=400&q=80' },
          { name: 'Outerwear', path: paths.customer.bestSellers, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80' },
          { name: 'Accessories', path: paths.customer.newArrivals, img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80' }
        ].map((cat, idx) => (
          <div
            key={idx}
            onClick={() => navigate(cat.path)}
            className="group relative h-72 md:h-80 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all"
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 inset-x-4 flex justify-between items-center text-white">
              <span className="font-heading font-bold text-sm tracking-wider uppercase">{cat.name}</span>
              <span className="p-1.5 bg-white text-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-md">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
