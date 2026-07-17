import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContactWidget } from '@/components/shared/FloatingContactWidget';

export default function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-primary transition-colors duration-300 w-full text-left font-sans">
      {/* Header */}
      <Header />

      {/* Main Content Render */}
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Contact Widget (Global for Customer) */}
      <FloatingContactWidget />
    </div>
  );
}
