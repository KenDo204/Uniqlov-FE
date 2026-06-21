import { useNavigate } from 'react-router-dom';
import {  ArrowRight  } from '@/components/ui/icons';
import { paths } from '@/config/paths';

export function LifestyleStory() {
  const navigate = useNavigate();
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-center bg-white dark:bg-gray-950 p-8 md:p-16 rounded-2xl border border-unilo-border dark:border-gray-800">
      <div className="space-y-6 max-w-lg">
        <span className="text-xs uppercase tracking-widest text-accent font-bold">OUR DESIGN PHILOSOPHY</span>
        <h2 className="text-3xl md:text-4xl font-heading font-black leading-tight m-0 text-primary dark:text-white">
          Designed for Utility.<br />Worn for Comfort.
        </h2>
        <p className="text-xs md:text-sm text-gray-500 m-0 leading-relaxed font-light">
          UNILO was founded on a simple insight: that the clothing we wear every day deserves the highest level of detail. We remove unnecessary logos, flashy tags, and seasonal styling fads to focus on material quality, tailored cuts, and durability.
        </p>
        <p className="text-xs md:text-sm text-gray-500 m-0 leading-relaxed font-light">
          Our fabrics are chosen based on thermal utility, stretch capabilities, and lightweight drapes. It is clothing built to serve your life, not the runway.
        </p>
        <button
          onClick={() => navigate(paths.customer.about)}
          className="btn-primary border-none cursor-pointer"
        >
          Read Our Story <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="h-[450px] bg-gray-150 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
        <img
          src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80"
          alt="UNILO Tailoring"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </section>
  );
}
