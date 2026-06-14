import React, { useState } from 'react';
import { toast } from 'react-toastify';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for joining! Your 10% coupon code UNILO10 has been sent to your email.');
    setEmail('');
  };

  return (
    <section className="bg-primary text-white p-8 md:p-16 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 w-full shadow-lg text-left">
      <div className="space-y-3 max-w-md">
        <h2 className="text-3xl font-heading font-black m-0 text-white">Join The UNILO Community</h2>
        <p className="text-xs md:text-sm text-gray-300 m-0 font-light">
          Subscribe to receive styling notes, exclusive access to capsule collections, and take 10% off your first order.
        </p>
      </div>

      <form onSubmit={handleNewsletterSubmit} className="w-full md:max-w-md flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-4 bg-white/10 dark:bg-black/30 border border-white/20 rounded-[12px] text-white text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder-gray-400"
          required
        />
        <button type="submit" className="btn-accent border-none py-4 px-6 shrink-0 bg-white text-primary font-black hover:bg-gray-150 active:scale-[0.98] cursor-pointer">
          Subscribe
        </button>
      </form>
    </section>
  );
}
