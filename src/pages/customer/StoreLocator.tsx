import { useState } from 'react';
import { MapPin, Phone, Clock, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  type: string;
}

export function StoreLocator() {
  const [searchCity, setSearchCity] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const stores: Store[] = [
    { id: 'st-tokyo', name: 'UNILO Tokyo Aoyama', address: '5-1-1 Minami-Aoyama, Minato-ku, Tokyo, Japan', phone: '+81-3-1234-5678', hours: '10:00 AM - 8:00 PM', type: 'Flagship Store' },
    { id: 'st-cph', name: 'UNILO Copenhagen Strøget', address: 'Strøget 42, 1160 København, Denmark', phone: '+45-33-12-34-56', hours: '10:00 AM - 7:00 PM', type: 'Flagship Store' },
    { id: 'st-nyc', name: 'UNILO New York Soho', address: '120 Prince St, New York, NY 10012, USA', phone: '+1-212-555-0199', hours: '11:00 AM - 8:00 PM', type: 'Concept Store' },
    { id: 'st-sf', name: 'UNILO San Francisco Hayes Valley', address: '300 Hayes St, San Francisco, CA 94102, USA', phone: '+1-415-555-0144', hours: '11:00 AM - 7:00 PM', type: 'Concept Store' }
  ];

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchCity.toLowerCase()) ||
      store.address.toLowerCase().includes(searchCity.toLowerCase())
  );

  const handleSelectClickAndCollect = (store: Store) => {
    toast.success(`Click & Collect set to: ${store.name}. Items can be picked up 2 hours after checking out!`);
  };

  return (
    <div className="space-y-8 text-left bg-unilo-muted min-h-screen pb-12">
      <div className="border-b border-unilo-border dark:border-gray-800 pb-6">
        <h1 className="text-3xl font-heading font-black m-0">Store Locator</h1>
        <p className="text-xs md:text-sm text-gray-500 m-0 mt-2 font-light">Find UNILO stores worldwide to try on fabrics and collect orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left List */}
        <div className="space-y-4 lg:col-span-1">
          <input
            type="text"
            placeholder="Search city, state or street address..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent"
          />

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${selectedStore?.id === store.id
                    ? 'bg-white border-primary shadow-md dark:bg-gray-900'
                    : 'bg-white hover:bg-gray-50 border-unilo-border dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-850'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white m-0">{store.name}</h3>
                  <span className="text-[9px] uppercase font-bold text-accent px-1.5 py-0.5 bg-accent/10 rounded">
                    {store.type}
                  </span>
                </div>
                <div className="space-y-2 mt-3 text-gray-500 font-light">
                  <p className="m-0 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" /> {store.address}</p>
                  <p className="m-0 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" /> {store.hours}</p>
                  <p className="m-0 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 shrink-0 text-gray-400" /> {store.phone}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectClickAndCollect(store);
                  }}
                  className="w-full mt-4 py-2 bg-primary text-white font-bold rounded-lg border-none hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white" /> Click & Collect Here
                </button>
              </div>
            ))}
            {filteredStores.length === 0 && (
              <div className="text-center text-gray-400 p-8">No stores found. Try searching Tokyo or New York.</div>
            )}
          </div>
        </div>

        {/* Right Map Mockup */}
        <div className="lg:col-span-2 h-[520px] bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-2xl relative overflow-hidden flex flex-col justify-end">
          {/* Map layout mockup */}
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center text-center">
            {/* Grid markings mimicking an architectural blueprint map */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <MapPin className="w-12 h-12 text-accent animate-bounce" />
            <p className="text-xs text-gray-400 mt-2 font-mono">
              {selectedStore ? `Displaying Map Coordinates: ${selectedStore.name}` : 'Select a store to view interactive location details'}
            </p>
          </div>

          {selectedStore && (
            <div className="m-6 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-unilo-border dark:border-gray-800 rounded-xl max-w-sm z-10 space-y-2 text-xs shadow-xl animate-slide-up">
              <h4 className="font-heading font-bold text-sm text-primary dark:text-white m-0">{selectedStore.name}</h4>
              <p className="m-0 text-gray-500 font-light">{selectedStore.address}</p>
              <div className="flex gap-4 pt-1 text-[10px] font-bold text-accent uppercase tracking-wider">
                <span>Distance: 0.8 mi</span>
                <span>In-Store pickup available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
