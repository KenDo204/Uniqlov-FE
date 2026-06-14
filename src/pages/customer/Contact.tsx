import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-toastify';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    toast.success('Your message has been sent to our customer care team! Expect a response within 24 hours.');
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div className="space-y-16 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Title */}
      <div className="max-w-2xl border-b border-unilo-border dark:border-gray-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-accent font-bold">GET IN TOUCH</span>
        <h1 className="text-3xl md:text-5xl font-heading font-black m-0 mt-2 tracking-tight">Contact UNILO</h1>
        <p className="text-xs md:text-sm text-gray-500 m-0 mt-2 max-w-xl font-light">Reach out for styling consultations, wholesale partnerships, or active orders help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact info channels */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-heading font-black m-0">Direct Channels</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-5 rounded-xl space-y-2 text-xs shadow-sm">
              <Phone className="w-5 h-5 text-accent" />
              <h3 className="font-heading font-bold text-sm m-0 text-primary dark:text-white">Call Support</h3>
              <p className="text-gray-500 font-light m-0">+1-800-UNILO-99</p>
              <span className="text-[10px] text-gray-400 block font-semibold">Mon-Fri 9AM - 6PM EST</span>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-5 rounded-xl space-y-2 text-xs shadow-sm">
              <Mail className="w-5 h-5 text-accent" />
              <h3 className="font-heading font-bold text-sm m-0 text-primary dark:text-white">Email Care</h3>
              <p className="text-gray-500 font-light m-0">care@UNILO.com</p>
              <span className="text-[10px] text-gray-400 block font-semibold">Expected reply: &lt;24 hours</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-xl space-y-3 text-xs shadow-sm">
            <MapPin className="w-5 h-5 text-accent" />
            <h3 className="font-heading font-bold text-sm m-0 text-primary dark:text-white">Headquarters Office</h3>
            <p className="text-gray-500 font-light m-0 leading-relaxed">
              UNILO Apparel Ltd.<br />
              Strøget 42, 1160 København<br />
              Denmark
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-heading font-bold m-0 border-b border-unilo-border dark:border-gray-850 pb-3">Leave a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Message</label>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="How can we help you?"
                rows={4}
                className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-bold rounded-xl text-xs hover:opacity-95 cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
