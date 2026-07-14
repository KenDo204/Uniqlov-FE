export function ProductCardSkeleton() {
  return (
    <div className="group text-left flex flex-col h-full bg-white transition-all duration-300 relative border-none">
      <div className="w-full aspect-[3/4] bg-gray-100 animate-pulse relative overflow-hidden">
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5 z-10">
           <div className="w-12 h-4 bg-gray-200/80 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col flex-1 pt-3 pb-2 gap-1.5">
        
        {/* Row 1: Swatches & Wishlist */}
        <div className="flex items-center justify-between min-h-[20px]">
          <div className="flex gap-1.5">
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Row 2: Category */}
        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse mt-1"></div>

        {/* Row 3: Name */}
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse mt-0.5"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        
        {/* Row 4: Price */}
        <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse mt-1"></div>

        {/* Row 5: Rating */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
