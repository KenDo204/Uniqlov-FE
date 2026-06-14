import { useState } from 'react';
import { Package, MapPin, Award, Share2, Clipboard, ArrowRight, Settings } from 'lucide-react';
import { toast } from 'react-toastify';

export function Account() {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'rewards' | 'settings'>('orders');

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('https://UNILO.com/refer?code=MEMBER7420');
    toast.success('Referral link copied to clipboard!');
  };

  return (
    <div className="space-y-8 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-heading font-black text-xl shadow-md">
            JD
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-black m-0">John Doe</h1>
            <p className="text-xs text-gray-400 m-0">UNILO Member since May 2026</p>
          </div>
        </div>

        {/* Loyalty points status */}
        <div className="bg-unilo-muted dark:bg-gray-800 px-4 py-3 rounded-xl border border-unilo-border dark:border-gray-700 flex items-center gap-3">
          <Award className="w-6 h-6 text-accent animate-pulse" />
          <div>
            <div className="text-[9px] uppercase font-bold text-gray-400">UNILO Points Balance</div>
            <div className="text-sm font-black">450 Points <span className="text-xs font-normal text-accent">(Silver Tier)</span></div>
          </div>
        </div>
      </div>

      {/* Main Account Portal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {([
            { key: 'orders', label: 'Order History', icon: Package },
            { key: 'addresses', label: 'Addresses Book', icon: MapPin },
            { key: 'rewards', label: 'Loyalty Rewards', icon: Award },
            { key: 'settings', label: 'Preferences', icon: Settings }
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer border-none text-left ${activeTab === tab.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white hover:bg-gray-50 text-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0">Your Orders</h3>

              {[
                { id: 'ORD-7429', date: 'June 02, 2026', total: 690000, status: 'Shipped', item: 'AirFlow Supima Cotton Crew Neck T-Shirt (Off-White / M)' },
                { id: 'ORD-6815', date: 'May 14, 2026', total: 1390000, status: 'Delivered', item: 'Premium Comfort Slim-Fit Chino Pants (Khaki / M)' }
              ].map((ord) => (
                <div key={ord.id} className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between gap-4 text-xs md:text-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary dark:text-white uppercase">{ord.id}</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-400">{ord.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-light m-0">{ord.item}</p>
                    <p className="font-bold m-0 text-primary dark:text-white">${(ord.total / 23000).toFixed(0)} USD</p>
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-2 shrink-0">
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border w-fit ${ord.status === 'Shipped'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-green-50 text-green-600 border-green-200'
                      }`}>
                      {ord.status}
                    </span>
                    <button className="text-xs text-accent font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer hover:underline p-0">
                      Track Shipment <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0">Address Book</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-5 rounded-2xl relative shadow-sm text-xs">
                  <span className="absolute top-4 right-4 text-[9px] uppercase font-bold text-accent">Default Shipping</span>
                  <div className="space-y-1.5 font-light pt-2">
                    <p className="font-bold text-sm m-0 text-primary dark:text-white">John Doe</p>
                    <p className="m-0 text-gray-500">1600 Amphitheatre Pkwy</p>
                    <p className="m-0 text-gray-500">Mountain View, CA 94043</p>
                    <p className="m-0 text-gray-500">United States</p>
                  </div>
                </div>

                <div className="border border-dashed border-unilo-border dark:border-gray-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:bg-white dark:hover:bg-gray-900/50 transition-all">
                  <span className="p-3 bg-unilo-muted dark:bg-gray-800 rounded-full text-gray-400">+</span>
                  <span className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider">Add New Address</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4 text-xs">
                <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0">UNILO Rewards Programs</h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  Earn points on every apparel purchase, clothing recovery collection donation, and community event check-in. Redeem points for discount coupons and member-exclusive sizing opportunities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-unilo-muted dark:bg-gray-800 rounded-xl border border-unilo-border dark:border-gray-700">
                    <h4 className="font-bold text-primary dark:text-white m-0 uppercase tracking-wider">Next Reward Goal</h4>
                    <p className="text-gray-500 font-light mt-1">Get 500 points to redeem a $20.00 coupon voucher.</p>
                    <div className="w-full bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-700 h-2 rounded-full overflow-hidden mt-3">
                      <div className="bg-accent h-full w-[90%]" />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1.5 text-right font-semibold">450 / 500 Points</div>
                  </div>

                  <div className="p-4 bg-unilo-muted dark:bg-gray-800 rounded-xl border border-unilo-border dark:border-gray-700 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-primary dark:text-white m-0 uppercase tracking-wider">Active Vouchers</h4>
                      <p className="text-gray-500 font-light mt-1">No active vouchers currently. Check back later.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral system */}
              <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4 text-xs text-left">
                <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Referral Program
                </h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  Share the UNILO concept with friends. They take 15% off their initial order, and you earn 200 UNILO reward points upon their shipping validation.
                </p>

                <div className="flex gap-2 w-full max-w-md">
                  <input
                    type="text"
                    readOnly
                    value="https://UNILO.com/refer?code=MEMBER7420"
                    className="flex-1 px-3 py-2 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs text-gray-500 outline-none"
                  />
                  <button
                    onClick={handleCopyReferral}
                    className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:opacity-95 cursor-pointer border-none flex items-center gap-1.5"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4 text-xs">
              <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0">Preferences & Settings</h3>

              <div className="space-y-4 max-w-md pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Default Apparel Size Fit</label>
                  <select className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs text-gray-700 dark:text-gray-300">
                    <option>Regular fit (True to size)</option>
                    <option>Fitted (Tight silhouette)</option>
                    <option>Loose fit (Casual oversized)</option>
                  </select>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="flex items-center gap-2.5 font-semibold text-gray-600 dark:text-gray-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-unilo-border accent-primary" />
                    <span>Receive weekly minimal styling newsletter notes</span>
                  </label>
                </div>

                <button
                  onClick={() => toast.success('Preferences updated.')}
                  className="px-6 py-3 bg-primary text-white font-bold text-xs rounded-xl hover:opacity-95 cursor-pointer border-none mt-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
