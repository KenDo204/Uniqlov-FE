import { Leaf, Recycle } from 'lucide-react';

export function Sustainability() {
  return (
    <div className="space-y-16 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Title */}
      <div className="max-w-2xl border-b border-unilo-border dark:border-gray-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-green-500 font-bold">ECO-COMMITMENTS</span>
        <h1 className="text-3xl md:text-5xl font-heading font-black m-0 mt-2 tracking-tight">Radical Sourcing Transparency</h1>
        <p className="text-xs md:text-sm text-gray-500 m-0 mt-2 max-w-xl font-light">How we balance premium apparel creation with low environmental impacts.</p>
      </div>

      {/* Sourcing Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { metric: '78%', label: 'Recycled Polymers used in Activewear' },
          { metric: '100%', label: 'Organic linen and Supima cotton supply' },
          { metric: '100%', label: 'OEKO-TEX Certified Chemical Safety' },
          { metric: '2030', label: 'Our Net-Zero Greenhouse Gas Target' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-3xl md:text-4xl font-heading font-black text-accent">{stat.metric}</div>
            <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mt-2 leading-relaxed">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Sourcing commitments details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="h-80 bg-gray-150 rounded-xl overflow-hidden shadow-sm">
          <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80" alt="Recycled Materials" className="w-full h-full object-cover object-center" />
        </div>
        <div className="space-y-4 text-xs md:text-sm text-gray-500 leading-relaxed font-light">
          <h2 className="text-xl md:text-2xl font-heading font-black m-0 text-primary dark:text-white flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-500" /> Sourcing Guidelines
          </h2>
          <p className="m-0">
            Every garment begins at the raw fiber level. We source French flax for linen, US Supima for cotton, and Australian Merino for sweaters. We only work with agricultural partners committed to crop rotation, soil health preservation, and pesticide-free growth.
          </p>
          <p className="m-0">
            For synthetic fabrics like our Dry-EX sportswear, we have replaced virgin polyester with recycled polymers derived from plastic bottles. This cuts carbon emissions by 40% while preventing waste from entering global oceans.
          </p>
        </div>
      </section>

      {/* Circular design and Collection program */}
      <section className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-8 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-green-50 dark:bg-green-950/20 text-green-500 border border-green-200/40 rounded-xl"><Recycle className="w-6 h-6 animate-spin-slow" /></span>
          <div>
            <h2 className="text-xl font-heading font-bold m-0">UNILO Clothes Recycling Scheme</h2>
            <p className="text-xs text-gray-400 m-0 mt-0.5">Bring back worn clothes. Close the circle loop.</p>
          </div>
        </div>

        <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-light m-0">
          Clothing should never be single-use. If your UNILO product reaches the end of its life cycle, bring it back to any physical store location or ship it back using our prepaid recycling label.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
          <div className="space-y-1.5 font-light">
            <h4 className="font-bold text-primary dark:text-white m-0 uppercase">1. Collect & Wash</h4>
            <p className="text-gray-500 m-0">We collect and clean returned items. Clothes still in wearable state are donated to local communities.</p>
          </div>
          <div className="space-y-1.5 font-light">
            <h4 className="font-bold text-primary dark:text-white m-0 uppercase">2. Shred & Refine</h4>
            <p className="text-gray-500 m-0">Garments past their wear limits are shredded down, cleaned, and spun back into recycled fibers.</p>
          </div>
          <div className="space-y-1.5 font-light">
            <h4 className="font-bold text-primary dark:text-white m-0 uppercase">3. Weave & Launch</h4>
            <p className="text-gray-500 m-0">Recycled yarns are woven with new fibers, returning as new essential clothing items on our shelves.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
