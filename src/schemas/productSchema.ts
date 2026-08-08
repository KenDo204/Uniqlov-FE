import { z } from 'zod';
import { hasBadWords } from '@/utils/badWordsValidator';
import { Gender } from '@/types/enums/genderType';

/** Product Image Schema */
export const productImageSchema = z.object({
  imageUrl: z.string().trim().url('Đường dẫn ảnh sản phẩm không hợp lệ').max(500, 'URL ảnh không vượt quá 500 ký tự'),
  isThumbnail: z.boolean().optional(),
  displayOrder: z.number().int().min(0, 'Thứ tự hiển thị không được âm').optional(),
});

/** Product Variant Base Schema */
const baseProductVariantSchema = z.object({
  price: z
    .number({ message: 'Giá bán phải lớn hơn hoặc bằng 1.000 VNĐ.' })
    .min(1000, 'Giá bán phải lớn hơn hoặc bằng 1.000 VNĐ.')
    .max(10000000, 'Giá bán không được vượt quá 10.000.000 VNĐ.'),
  costPrice: z
    .number({ message: 'Giá vốn phải lớn hơn hoặc bằng 1.000 VNĐ.' })
    .min(1000, 'Giá vốn phải lớn hơn hoặc bằng 1.000 VNĐ.')
    .max(10000000, 'Giá vốn không được vượt quá 10.000.000 VNĐ.'),
  variantAttributes: z.record(z.string().trim(), z.string().trim()),
  skuCode: z.string().trim().max(100, 'Mã SKU không quá 100 ký tự').optional(),
  variantImage: z.string().trim().url('URL ảnh biến thể không hợp lệ').max(500).optional().or(z.literal('')),
  stockQuantity: z.number().int().min(0, 'Số lượng tồn kho không được âm').max(100000, 'Số lượng tồn kho tối đa 100.000'),
});

/** Product Variant Schema with price >= costPrice refinement */
export const productVariantSchema = baseProductVariantSchema.refine(
  (data) => data.price >= data.costPrice,
  {
    message: 'Giá bán phải lớn hơn hoặc bằng giá vốn.',
    path: ['price'],
  }
);

/** Base Product Create Schema */
const baseProductCreateSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
    .max(150, 'Tên sản phẩm không được vượt quá 150 ký tự')
    .refine((val) => !hasBadWords(val), 'Tên sản phẩm chứa từ ngữ không phù hợp'),
  productDescription: z.string().trim().max(5000, 'Mô tả không được vượt quá 5000 ký tự').optional().refine((val) => !hasBadWords(val), 'Mô tả sản phẩm chứa từ ngữ không phù hợp'),
  inPopular: z.boolean().optional(),
  targetGender: z.nativeEnum(Gender).optional(),
  maxOrderQuantity: z.number().int().min(1, 'Số lượng mua tối đa phải >= 1').max(100, 'Số lượng mua tối đa <= 100').optional(),
  optionsConfig: z.record(z.string(), z.any()).optional(),
  productTags: z
    .array(
      z.string().trim().refine((t) => !/\d/.test(t), {
        message: 'Thẻ sản phẩm không được chứa chữ số',
      }).refine((val) => !hasBadWords(val), 'Thẻ sản phẩm chứa từ ngữ không phù hợp')
    )
    .optional(),
  categoryId: z.number().int().positive('Vui lòng chọn danh mục hợp lệ').optional(),
  weightKg: z
    .number()
    .min(0.01, 'Trọng lượng phải từ 0.01 đến 5.00kg')
    .max(5.0, 'Trọng lượng phải từ 0.01 đến 5.00kg')
    .optional(),
  lengthM: z
    .number()
    .min(0.05, 'Chiều dài phải từ 0.05 đến 0.80m')
    .max(0.8, 'Chiều dài phải từ 0.05 đến 0.80m')
    .optional(),
  widthM: z
    .number()
    .min(0.05, 'Chiều rộng phải từ 0.05 đến 0.60m')
    .max(0.6, 'Chiều rộng phải từ 0.05 đến 0.60m')
    .optional(),
  heightM: z
    .number()
    .min(0.005, 'Chiều cao phải từ 0.005 đến 0.30m')
    .max(0.3, 'Chiều cao phải từ 0.005 đến 0.30m')
    .optional(),
  variants: z.array(productVariantSchema).min(1, 'Sản phẩm phải có ít nhất 1 biến thể'),
  images: z.array(productImageSchema).optional(),
});

/** 1. Create Product Schema */
export const productCreateSchema = baseProductCreateSchema.refine(
  (data) => {
    if (data.lengthM !== undefined && data.widthM !== undefined && data.heightM !== undefined) {
      return data.lengthM >= data.widthM && data.widthM >= data.heightM;
    }
    return true;
  },
  {
    message: 'Chiều dài phải lớn hơn hoặc bằng chiều rộng và chiều rộng phải lớn hơn hoặc bằng chiều cao.',
    path: ['lengthM'],
  }
);
export type ProductCreateFormValues = z.infer<typeof productCreateSchema>;

/** 2. Update Product Schema */
export const productUpdateSchema = baseProductCreateSchema.partial();
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
