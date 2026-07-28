import { z } from 'zod';
import { Gender } from '@/types/enums/genderType';

/** Product Image Schema */
export const productImageSchema = z.object({
  imageUrl: z.string().trim().url('Đường dẫn ảnh sản phẩm không hợp lệ').max(500, 'URL ảnh không vượt quá 500 ký tự'),
  isThumbnail: z.boolean().optional(),
  displayOrder: z.number().int().min(0, 'Thứ tự hiển thị không được âm').optional(),
});

/** Product Variant Schema */
export const productVariantSchema = z.object({
  price: z
    .number()
    .positive('Giá bán phải lớn hơn 0')
    .min(1000, 'Giá bán tối thiểu là 1.000đ')
    .max(1000000000, 'Giá bán tối đa là 1.000.000.000đ'),
  costPrice: z
    .number()
    .positive('Giá vốn phải lớn hơn 0')
    .min(1000, 'Giá vốn tối thiểu là 1.000đ')
    .max(1000000000, 'Giá vốn không vượt quá 1.000.000.000đ'),
  variantAttributes: z.record(z.string().trim(), z.string().trim()),
  skuCode: z.string().trim().max(100, 'Mã SKU không quá 100 ký tự').optional(),
  variantImage: z.string().trim().url('URL ảnh biến thể không hợp lệ').max(500).optional().or(z.literal('')),
  stockQuantity: z.number().int().min(0, 'Số lượng tồn kho không được âm').max(100000, 'Số lượng tồn kho tối đa 100.000'),
});

/** 1. Create Product Schema */
export const productCreateSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
    .max(150, 'Tên sản phẩm không được vượt quá 150 ký tự'),
  productDescription: z.string().trim().max(2000, 'Mô tả không được vượt quá 2000 ký tự').optional(),
  inPopular: z.boolean().optional(),
  targetGender: z.nativeEnum(Gender).optional(),
  maxOrderQuantity: z.number().int().min(1, 'Số lượng mua tối đa phải >= 1').max(100, 'Số lượng mua tối đa <= 100').optional(),
  optionsConfig: z.record(z.string(), z.any()).optional(),
  productTags: z.array(z.string().trim().max(50)).optional(),
  categoryId: z.number().int().positive('Vui lòng chọn danh mục hợp lệ').optional(),
  weightKg: z.number().positive('Trọng lượng phải > 0').max(100, 'Trọng lượng tối đa 100kg').optional(),
  lengthM: z.number().positive('Chiều dài phải > 0').max(10, 'Chiều dài tối đa 10m').optional(),
  widthM: z.number().positive('Chiều rộng phải > 0').max(10, 'Chiều rộng tối đa 10m').optional(),
  heightM: z.number().positive('Chiều cao phải > 0').max(10, 'Chiều cao tối đa 10m').optional(),
  variants: z.array(productVariantSchema).min(1, 'Sản phẩm phải có ít nhất 1 biến thể'),
  images: z.array(productImageSchema).optional(),
});
export type ProductCreateFormValues = z.infer<typeof productCreateSchema>;

/** 2. Update Product Schema */
export const productUpdateSchema = productCreateSchema.partial();
export type ProductUpdateFormValues = z.infer<typeof productUpdateSchema>;

/** 3. Product Filter Schema */
export const productFilterSchema = z.object({
  keyword: z.string().trim().max(100, 'Từ khóa không quá 100 ký tự').optional(),
  categoryCode: z.string().trim().max(100).optional(),
  collection: z.string().trim().max(100).optional(),
  minPrice: z.number().min(0, 'Giá min không được âm').optional(),
  maxPrice: z.number().positive('Giá max phải > 0').optional(),
  minRating: z.number().min(1).max(5).optional(),
  targetGender: z.number().int().optional(),
  inStock: z.boolean().optional(),
  inPopular: z.boolean().optional(),
  variantSize: z.string().trim().max(20).optional(),
});
export type ProductFilterFormValues = z.infer<typeof productFilterSchema>;
