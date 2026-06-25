// import type { ProductHomepage } from '@/types/productTypes';
// import { useNavigate } from 'react-router-dom';
// import { Rating as MuiRating } from '@mui/material';

// interface ProductCardProps {
//     product: ProductHomepage;
//     isFocused?: boolean;
//     cardRef?: (element: HTMLDivElement | null) => void;
// }

// export default function ProductCard({ product, isFocused = false, cardRef }: ProductCardProps) {
//     const navigate = useNavigate();

//     // Mock rating for demonstration (since it's typically pulled from API in production)
//     const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
//     const reviewCount = Math.floor(Math.random() * 500) + 10;

//     const discountPercent = Math.floor((1 - Number(product.price) / Number(product.originalPrice)) * 100);

//     return (
//         <div
//             ref={cardRef}
//             className={`group cursor-pointer flex flex-col bg-white hover:shadow-lg transition-all duration-300 h-full overflow-hidden ${isFocused
//                 ? 'ring-2 ring-[#00927c] shadow-[0_12px_30px_rgba(0,146,124,0.35)] scale-[1.02]'
//                 : ''
//                 }`}
//             onClick={() => {
//                 navigate(`/product-details/${product.productId}`)
//             }}
//         >
//             {/* Image Container */}
//             <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
//                 <img
//                     className="w-full h-full object-cover"
//                     src={typeof product.imageUrl === 'number' ? `https://picsum.photos/400/400?random=${product.productId}` : (product.imageUrl || 'https://via.placeholder.com/400x400')}
//                     alt={product.name}
//                 />
//             </div>

//             {/* Product Details */}
//             <div className="p-2.5 flex flex-col flex-1 bg-white">
//                 {/* Title and Badge */}
//                 <div className="mb-1">
//                     <h3 className="text-[13px] text-gray-800 line-clamp-2 leading-[18px]">
//                         {product.isMall && (
//                             <span className="inline-block bg-teal-600 text-white text-[10px] font-semibold px-1 rounded-sm uppercase tracking-tight mr-1.5 align-text-bottom">
//                                 ShopMall
//                             </span>
//                         )}
//                         <span className="align-middle group-hover:text-teal-600 transition-colors">
//                             {product.name}
//                         </span>
//                     </h3>
//                 </div>

//                 {/* Price and Discount */}
//                 <div className="mt-auto pt-1">
//                     <div className="flex items-center gap-1.5 mb-1">
//                         <span className="font-medium text-[17px] text-teal-600">
//                             ₫{product.price?.toLocaleString('vi-VN')}
//                         </span>
//                         {discountPercent > 0 && (
//                             <span className="text-[11px] p-0.5 px-1 rounded-sm text-white bg-highlight-color">
//                                 -{discountPercent}%
//                             </span>
//                         )}
//                     </div>

//                     {/* Rating */}
//                     <div className="flex items-center gap-1">
//                         <MuiRating value={rating} readOnly size="small" sx={{ fontSize: '0.75rem' }} />
//                         <span className="text-[11px] text-gray-400">({reviewCount})</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };