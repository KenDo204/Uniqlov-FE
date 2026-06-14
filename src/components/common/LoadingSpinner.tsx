export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative w-12 h-12">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-pink-500 border-b-blue-500 border-l-transparent animate-spin"></div>
        {/* Inner reverse-spinning ring */}
        <div className="absolute inset-2 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-pink-500 animate-spin [animation-duration:1.5s] [animation-direction:reverse]"></div>
      </div>
      <span className="text-sm font-semibold tracking-wider bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
        Đang tải...
      </span>
    </div>
  );
}
