import { cn } from '@/lib/utils';

export interface CategoryCardProps {
  displayName: string;
  iconUrl?: string;
  isActive: boolean;
  onClick: () => void;
}

export function CategoryCard({ displayName, iconUrl, isActive, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer flex flex-col w-full h-[250px] rounded-[10px] overflow-hidden transition-all duration-300 transform group",
        isActive
          ? "bg-white border-2 border-theme shadow-md"
          : "bg-[#fafafa] border border-transparent hover:-translate-y-[3px] hover:shadow-lg"
      )}
    >
      {/* Image Area - Cố định chiều cao */}
      <div className="h-[180px] w-full overflow-hidden">
        <img
          src={iconUrl || 'https://via.placeholder.com/150'}
          alt={displayName}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105"
        />
      </div>

      {/* Label Area - Cố định chiều cao */}
      <div className="h-[60px] px-3 flex flex-col justify-center">
        <span
          className={cn(
            "text-center text-[13px] sm:text-[14px] leading-snug line-clamp-2 transition-colors",
            isActive ? "font-semibold text-theme" : "font-medium text-gray-700 group-hover:text-theme"
          )}
          title={displayName}
        >
          {displayName}
        </span>
      </div>
    </div>
  );
}
