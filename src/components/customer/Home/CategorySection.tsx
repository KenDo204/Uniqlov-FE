import { useEffect } from 'react';
import { useCategory } from '@/hooks/useCategory';
import { useNavigate } from 'react-router-dom';

export function CategorySection() {
  const { categories, fetchPublicCategories } = useCategory();
  const navigate = useNavigate();

  useEffect(() => {
    if (categories.length === 0) {
      fetchPublicCategories();
    }
  }, [categories.length, fetchPublicCategories]);

  // Lấy 6 danh mục hiển thị
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="max-w-[1200px] mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-6">
        {displayCategories.map((cat) => (
          <div
            key={cat.categoryId}
            onClick={() => navigate(`/products?categoryCode=${cat.categoryCode}`)}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            {/* Vùng chứa ảnh: kích thước to hơn, bo tròn mềm mại và hover effect */}
            <div className="w-32 h-32 md:w-40 md:h-40 mb-6 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-lg bg-gray-50 rounded-full overflow-hidden border border-gray-100 group-hover:border-[var(--color-theme)]">
              <img
                src={cat.iconUrl || 'https://via.placeholder.com/150'}
                alt={cat.categoryName}
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            {/* Tên danh mục: chữ to hơn, hiện đại */}
            <span className="text-[14px] md:text-[15px] font-bold uppercase text-gray-700 group-hover:text-[var(--color-theme)] tracking-wider leading-snug transition-colors">
              {cat.categoryName}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
