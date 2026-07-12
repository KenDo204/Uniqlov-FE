export function ProductCardSkeleton() {
  return (
    <div className="group text-left flex flex-col h-full bg-white transition-all duration-300 rounded-[4px] border border-transparent">
      <div className="w-full aspect-[3/4] bg-gray-200 rounded-t-[4px] animate-pulse relative">
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
           <div className="w-12 h-5 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse mt-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Color swatches skeleton */}
        <div className="flex gap-1.5 pt-2">
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Footer skeleton */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1 border-t border-unilo-border dark:border-gray-800 mt-auto">
        <div className="flex items-end gap-2 pt-1">
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
