import { useState } from "react";
import { Link } from "react-router";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: string[]; // hex codes
  rating?: number;
  reviewCount?: number;
  isNewArrival?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  images,
  colors,
  rating = 0,
  reviewCount = 0,
  isNewArrival = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isSale = originalPrice !== undefined && originalPrice > price;

  return (
    <div 
      className="group flex flex-col gap-3 relative w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {isNewArrival && (
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase">
            New
          </span>
        )}
        {isSale && (
          <span className="bg-accent text-white text-[10px] font-bold px-2 py-1 uppercase">
            Sale
          </span>
        )}
      </div>

      {/* Image Gallery */}
      <Link to={`/product/${id}`} className="block relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={images[0]}
          alt={name}
          className={cn(
            "object-cover w-full h-full transition-opacity duration-300",
            isHovered && images.length > 1 ? "opacity-0" : "opacity-100"
          )}
        />
        {images.length > 1 && (
          <img
            src={images[1]}
            alt={`${name} secondary`}
            className={cn(
              "absolute inset-0 object-cover w-full h-full transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        {/* Colors */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 mb-1">
            {colors.slice(0, 4).map((color, idx) => (
              <div 
                key={idx} 
                className="w-4 h-4 rounded-sm border border-border-base cursor-pointer hover:border-black transition-colors"
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-xs text-gray-500 flex items-center">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <Link to={`/product/${id}`}>
          <h3 className="text-sm font-medium line-clamp-2 leading-snug group-hover:underline">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className={cn("text-[15px] font-bold", isSale ? "text-accent" : "text-primary")}>
            ${price.toFixed(2)}
          </span>
          {isSale && (
            <span className="text-[13px] text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Ratings */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn("w-3 h-3", i < Math.floor(rating) ? "fill-current" : "fill-gray-200 text-gray-200")} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        )}
      </div>
    </div>
  );
}
