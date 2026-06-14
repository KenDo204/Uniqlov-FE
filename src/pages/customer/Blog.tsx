/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { paths } from '../../config/paths';

export interface BlogEntry {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: 'Material Science' | 'Style Notes' | 'Living';
  image: string;
}

export const mockBlogEntries: BlogEntry[] = [
  {
    id: 'material-supima',
    title: 'The Science Behind Supima: Why Long-Staple Cotton Matters',
    excerpt: 'Explore how long-staple fibers double the structural strength and yield softer, pilling-resistant everyday basic tees.',
    date: 'June 01, 2026',
    readTime: '4 min read',
    category: 'Material Science',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80'
  },
  {
    id: 'minimalist-wardrobe',
    title: 'How to Build a Ten-Item Minimalist Capsule Wardrobe',
    excerpt: 'Ditch seasonal fads. Learn to curate a functional coordinate system that transitions from desk layouts to evening dinners.',
    date: 'May 24, 2026',
    readTime: '6 min read',
    category: 'Style Notes',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80'
  },
  {
    id: 'merino-insulation',
    title: 'Australian Merino Wool: Nature’s Temperature Regulator',
    excerpt: 'An inside look at how micro-scale scales on Merino wool fibers wick dampness and trap lightweight insulation warmth.',
    date: 'May 10, 2026',
    readTime: '5 min read',
    category: 'Material Science',
    image: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=600&q=80'
  }
];

export function Blog() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Title */}
      <div className="max-w-2xl border-b border-unilo-border dark:border-gray-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-accent font-bold">UNILO JOURNAL</span>
        <h1 className="text-3xl md:text-5xl font-heading font-black m-0 mt-2 tracking-tight">The UNILO Journal</h1>
        <p className="text-xs md:text-sm text-gray-500 m-0 mt-2 max-w-xl font-light">Documentaries covering textile innovations, minimal living philosophies, and style coordinate guides.</p>
      </div>

      {/* Featured post */}
      {mockBlogEntries[0] && (
        <div
          onClick={() => navigate(paths.customer.blogArticle.replace(':id', mockBlogEntries[0].id))}
          className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 md:p-8 rounded-2xl cursor-pointer hover:shadow-md transition-all"
        >
          <div className="h-[320px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
            <img src={mockBlogEntries[0].image} alt={mockBlogEntries[0].title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 object-center" />
          </div>

          <div className="space-y-4">
            <span className="px-2.5 py-1 bg-accent text-white text-[9px] font-black uppercase tracking-wider rounded">
              Featured Article
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold pt-1">
              <span>{mockBlogEntries[0].category}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {mockBlogEntries[0].readTime}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-heading font-black m-0 text-primary dark:text-white group-hover:text-accent transition-colors leading-tight">
              {mockBlogEntries[0].title}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed m-0">
              {mockBlogEntries[0].excerpt}
            </p>
            <span className="text-xs font-bold text-accent group-hover:underline flex items-center gap-1.5 pt-2">
              Read Entire Article <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <section className="space-y-6 pt-4">
        <h3 className="text-lg font-heading font-black m-0 border-b border-unilo-border dark:border-gray-800 pb-2 uppercase tracking-wider">Latest Entries</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockBlogEntries.slice(1).map((entry) => (
            <div
              key={entry.id}
              onClick={() => navigate(paths.customer.blogArticle.replace(':id', entry.id))}
              className="group bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col justify-between text-xs"
            >
              <div className="h-48 bg-gray-150 overflow-hidden">
                <img src={entry.image} alt={entry.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 font-semibold">
                    <span>{entry.category}</span>
                    <span>•</span>
                    <span>{entry.readTime}</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white m-0 group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {entry.title}
                  </h4>
                  <p className="text-gray-500 font-light leading-relaxed m-0 line-clamp-3">
                    {entry.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-unilo-border dark:border-gray-850 flex items-center justify-between text-gray-400 font-bold text-[10px]">
                  <span>{entry.date}</span>
                  <span className="text-accent group-hover:underline flex items-center gap-1">Read &gt;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
