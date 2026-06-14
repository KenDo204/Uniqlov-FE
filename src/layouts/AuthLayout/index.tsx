import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 w-full text-left">
      {/* Left side: Premium branding column (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-purple-700 via-indigo-800 to-blue-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative dynamic shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        
        <div className="max-w-md text-white relative z-10 space-y-6">
          <Link to="/" className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
            Yami Music
          </Link>
          <p className="text-lg text-indigo-100">
            Nơi kết nối đam mê nghệ thuật với các loại nhạc cụ chất lượng hàng đầu.
          </p>
          <div className="pt-8 border-t border-white/10 flex gap-8 text-sm text-indigo-200">
            <div>
              <span className="font-bold text-white block text-xl">10k+</span>
              Khách hàng tin dùng
            </div>
            <div>
              <span className="font-bold text-white block text-xl">500+</span>
              Nhạc cụ cao cấp
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form container */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
