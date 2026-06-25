import {  Sparkles, Leaf, ShieldCheck  } from '@/components/ui/icons';

export function ValueProposition() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-unilo-border dark:border-gray-800">
      <div className="space-y-3 p-4 text-center md:text-left">
        <span className="inline-flex p-3 bg-primary text-white rounded-xl">
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
        </span>
        <h3 className="font-heading font-bold text-lg m-0 text-primary dark:text-white">Premium Fabric Formulations</h3>
        <p className="text-xs md:text-sm text-gray-500 m-0 leading-relaxed">
          We partner with historical mills in Japan and Europe to weave custom blends like Supima cotton, long-staple linen, and extra-fine Merino wool.
        </p>
      </div>
      <div className="space-y-3 p-4 text-center md:text-left">
        <span className="inline-flex p-3 bg-primary text-white rounded-xl">
          <Leaf className="w-5 h-5 text-green-400" />
        </span>
        <h3 className="font-heading font-bold text-lg m-0 text-primary dark:text-white">Designed For Everyday Wear</h3>
        <p className="text-xs md:text-sm text-gray-500 m-0 leading-relaxed">
          Our clean silhouettes look sharp in a coffee shop, standard at the office, and casual at home. Designed around motion and functional utility.
        </p>
      </div>
      <div className="space-y-3 p-4 text-center md:text-left">
        <span className="inline-flex p-3 bg-primary text-white rounded-xl">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
        </span>
        <h3 className="font-heading font-bold text-lg m-0 text-primary dark:text-white">Built To Last (Circular Focus)</h3>
        <p className="text-xs md:text-sm text-gray-500 m-0 leading-relaxed">
          Double-stitched seams, anti-pilling coatings, and colorfast dye fibers. We support clothing recovery programs to recycle every UNILO product.
        </p>
      </div>
    </section>
  );
}
