import {  Star  } from '@/components/ui/icons';

export function CustomerReviews() {
  return (
    <section className="space-y-6 max-w-[1400px] mx-auto px-4 lg:px-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-black m-0">UNILO Community Voices</h2>
        <p className="text-xs md:text-sm text-gray-500 m-0 mt-1 uppercase tracking-wider font-semibold">Feedback from real buyers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            author: 'Sophia K.',
            rating: 5,
            text: 'The Supima Tee is incredibly soft. I’ve washed it 10 times and it hasn’t shrunk or faded. Perfect wardrobe basic.',
            product: 'Supima Cotton Crew Neck T-Shirt',
            fit: 'True to size',
            img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80'
          },
          {
            author: 'David L.',
            rating: 5,
            text: 'UNILO’s Merino Wool sweater is thin enough to comfortably wear under a blazer but incredibly warm on cool mornings.',
            product: 'Merino Wool Sweater',
            fit: 'True to size',
            img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80'
          },
          {
            author: 'Emily M.',
            rating: 4.8,
            text: 'The wide trousers flow beautifully when I walk and don’t wrinkle at all. Buying the beige color variant next.',
            product: 'Pleated Drape Trousers',
            fit: 'Slightly long',
            img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80'
          }
        ].map((rev, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-xl flex flex-col justify-between space-y-4 shadow-sm text-left">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-primary dark:text-white">{rev.author}</span>
                <div className="flex text-yellow-400 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-500 m-0 leading-relaxed italic">"{rev.text}"</p>
            </div>

            <div className="flex gap-3 items-center pt-3 border-t border-unilo-border dark:border-gray-800">
              <img src={rev.img} alt={rev.product} className="w-10 h-10 object-cover rounded-full" />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Purchased</div>
                <div className="text-xs font-semibold text-primary dark:text-white truncate">{rev.product}</div>
                <div className="text-[9px] text-accent uppercase font-bold tracking-wider">{rev.fit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
