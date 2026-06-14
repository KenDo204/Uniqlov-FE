import { ArrowRight, Leaf, ShieldCheck, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';

export function About() {
  const navigate = useNavigate();
  return (
    <div className="space-y-16 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Editorial Title */}
      <div className="max-w-2xl border-b border-unilo-border dark:border-gray-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-accent font-bold">BRAND IDENTITY</span>
        <h1 className="text-3xl md:text-5xl font-heading font-black m-0 mt-2 tracking-tight">The UNILO Concept</h1>
        <p className="text-xs md:text-sm text-gray-500 m-0 mt-2 max-w-xl font-light">"Essential Clothing. Designed for Everyday Life."</p>
      </div>

      {/* Narrative Section 1 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-xs md:text-sm text-gray-500 leading-relaxed font-light">
          <h2 className="text-xl md:text-2xl font-heading font-black m-0 text-primary dark:text-white">Our Design Origins</h2>
          <p className="m-0">
            UNILO was created at the intersection of two design schools: the quiet simplicity of Japanese functional apparel and the clean warmth of Scandinavian interiors. We believe the clothes you wear every day should be engineered with detail, yet look entirely effortless.
          </p>
          <p className="m-0">
            By removing unnecessary labels, loud colors, and fast-moving trends, we create a unified wardrobe system that stands the test of time. Every collar binding is reinforced; every fiber is combed for softness; every seam is double-stitched for structural integrity.
          </p>
        </div>
        <div className="h-80 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
          <img src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80" alt="UNILO Craftsmanship" className="w-full h-full object-cover object-center" />
        </div>
      </section>

      {/* Narrative Section 2 - Core pillars */}
      <section className="space-y-6">
        <h2 className="text-xl md:text-2xl font-heading font-black m-0">Our Core Pillars</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-xl space-y-3 text-xs shadow-sm">
            <span className="inline-flex p-2.5 bg-primary text-white rounded-lg"><Cpu className="w-4 h-4 text-accent" /></span>
            <h3 className="font-heading font-bold text-sm m-0 text-primary dark:text-white">1. Functional Innovation</h3>
            <p className="text-gray-500 font-light leading-relaxed">We develop technical fabrics like Dry-EX active moisture wicking, thermal wool cores, and water-resistant micro-nylons to insulate and cool naturally.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-xl space-y-3 text-xs shadow-sm">
            <span className="inline-flex p-2.5 bg-primary text-white rounded-lg"><Leaf className="w-4 h-4 text-green-400" /></span>
            <h3 className="font-heading font-bold text-sm m-0 text-primary dark:text-white">2. Circular Ecology</h3>
            <p className="text-gray-500 font-light leading-relaxed">We source organic, recycled materials and design garments to be easily disassembled for recycling, striving to keep materials out of landfills.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-xl space-y-3 text-xs shadow-sm">
            <span className="inline-flex p-2.5 bg-primary text-white rounded-lg"><ShieldCheck className="w-4 h-4 text-blue-400" /></span>
            <h3 className="font-heading font-bold text-sm m-0 text-primary dark:text-white">3. Radical Longevity</h3>
            <p className="text-gray-500 font-light leading-relaxed">We reject fast fashion cycles. Our designs are built physically to withstand years of active washing, and aesthetically to look correct across decades.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white p-8 md:p-12 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5">
          <h3 className="text-xl font-heading font-black m-0 text-white">Join us on our ecological mission</h3>
          <p className="text-xs text-gray-300 m-0 font-light">Learn about our sustainable sourcing commitments and product life cycles.</p>
        </div>
        <button
          onClick={() => navigate(paths.customer.sustainability)}
          className="btn-accent border-none py-3.5 px-6 shrink-0 bg-white text-primary font-bold hover:bg-gray-50 cursor-pointer flex items-center gap-1.5 text-xs uppercase"
        >
          Explore Sustainability <ArrowRight className="w-4 h-4 text-primary" />
        </button>
      </section>
    </div>
  );
}
