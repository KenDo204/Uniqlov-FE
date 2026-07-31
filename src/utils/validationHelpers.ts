/**
 * Validation and sanitization helpers for EasyMall forms.
 */

/**
 * Sanitizes phone input by keeping only digits and limiting to 10 characters.
 */
export const sanitizePhoneInput = (val: string): string => {
  return val.replace(/\D/g, '').slice(0, 10);
};

/**
 * Validates phone number (must be exactly 10 digits).
 */
export const validatePhoneNumber = (phone: string): string | null => {
  if (!phone || phone.trim().length === 0) {
    return 'Số điện thoại là bắt buộc';
  }
  if (!/^\d{10}$/.test(phone)) {
    return 'Số điện thoại phải bao gồm đúng 10 chữ số';
  }
  return null;
};

/**
 * Validates product tag input string (comma separated).
 * Does not allow any digits in tags.
 */
export const validateProductTagInput = (input: string): { isValid: boolean; errorMessage?: string; tags: string[] } => {
  if (!input.trim()) return { isValid: true, tags: [] };

  if (/\d/.test(input)) {
    return {
      isValid: false,
      errorMessage: 'Thẻ sản phẩm không được chứa chữ số (chỉ cho phép chữ và khoảng trắng, ví dụ: Cotton, Summer, Fashion).',
      tags: [],
    };
  }

  const tags = input
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  return { isValid: true, tags };
};

/**
 * Validates product shipping dimensions & relationship: length >= width >= height.
 */
export const validateProductDimensions = (
  weightKgStr: string,
  lengthMStr: string,
  widthMStr: string,
  heightMStr: string
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const w = Number(weightKgStr);
  const l = Number(lengthMStr);
  const wi = Number(widthMStr);
  const h = Number(heightMStr);

  if (weightKgStr === '' || isNaN(w) || w < 0.01 || w > 5.0) {
    errors.weightKg = 'Trọng lượng phải từ 0.01 đến 5.00 kg';
  }

  if (lengthMStr === '' || isNaN(l) || l < 0.05 || l > 0.8) {
    errors.lengthM = 'Chiều dài phải từ 0.05 đến 0.80 m';
  }

  if (widthMStr === '' || isNaN(wi) || wi < 0.05 || wi > 0.6) {
    errors.widthM = 'Chiều rộng phải từ 0.05 đến 0.60 m';
  }

  if (heightMStr === '' || isNaN(h) || h < 0.005 || h > 0.3) {
    errors.heightM = 'Chiều cao phải từ 0.005 đến 0.30 m';
  }

  // Relationship check: length >= width >= height
  if (!errors.lengthM && !errors.widthM && !errors.heightM) {
    if (l < wi || wi < h) {
      const msg = 'Chiều dài phải lớn hơn hoặc bằng chiều rộng và chiều rộng phải lớn hơn hoặc bằng chiều cao.';
      errors.lengthM = msg;
      errors.widthM = msg;
      errors.heightM = msg;
    }
  }

  return errors;
};

/**
 * Validates price and costPrice for a product.
 * Enforces price >= 1000, price <= 10.000.000, costPrice >= 1000, costPrice <= 10.000.000,
 * and price >= costPrice.
 */
export const validateProductPricing = (
  priceStr: string,
  costPriceStr: string
): { errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const price = Number(priceStr);
  const cost = Number(costPriceStr);

  if (priceStr === '' || priceStr === undefined || priceStr === null) {
    errors.price = 'Giá bán phải lớn hơn hoặc bằng 1.000 VNĐ.';
  } else if (isNaN(price) || price < 1000) {
    errors.price = 'Giá bán phải lớn hơn hoặc bằng 1.000 VNĐ.';
  } else if (price > 10000000) {
    errors.price = 'Giá bán không được vượt quá 10.000.000 VNĐ.';
  }

  if (costPriceStr === '' || costPriceStr === undefined || costPriceStr === null) {
    errors.costPrice = 'Giá vốn phải lớn hơn hoặc bằng 1.000 VNĐ.';
  } else if (isNaN(cost) || cost < 1000) {
    errors.costPrice = 'Giá vốn phải lớn hơn hoặc bằng 1.000 VNĐ.';
  } else if (cost > 10000000) {
    errors.costPrice = 'Giá vốn không được vượt quá 10.000.000 VNĐ.';
  }

  // Relationship check: price >= costPrice
  if (!errors.price && !errors.costPrice && price < cost) {
    errors.price = 'Giá bán phải lớn hơn hoặc bằng giá vốn.';
  }

  return { errors };
};

/**
 * Validates Coupon form inputs.
 */
export interface CouponFormInputs {
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: string;
  maxDiscountAmount: string;
  minOrderAmount: string;
  maxUsage: string;
  userUsageLimit: string;
}

export const validateCouponInputs = (inputs: CouponFormInputs): Record<string, string> => {
  const errors: Record<string, string> = {};
  const { discountType, discountValue, maxDiscountAmount, minOrderAmount, maxUsage, userUsageLimit } = inputs;

  const val = Number(discountValue);
  if (discountValue === '' || isNaN(val) || val <= 0) {
    errors.discountValue = 'Mức giảm giá phải lớn hơn 0';
  } else if (discountType === 'PERCENTAGE' && val > 100) {
    errors.discountValue = 'Mức giảm giá phần trăm phải từ 1 đến 100%';
  }

  if (discountType === 'PERCENTAGE' && maxDiscountAmount !== '') {
    const maxDisc = Number(maxDiscountAmount);
    if (isNaN(maxDisc) || maxDisc < 0 || maxDisc > 10000000) {
      errors.maxDiscountAmount = 'Mức giảm tối đa phải từ 0 đến 10.000.000đ';
    }
  }

  if (minOrderAmount !== '') {
    const minOrder = Number(minOrderAmount);
    if (isNaN(minOrder) || minOrder < 0 || minOrder > 10000000) {
      errors.minOrderAmount = 'Giá trị đơn hàng tối thiểu phải từ 0 đến 10.000.000đ';
    }
  }

  if (maxUsage !== '') {
    const maxUse = Number(maxUsage);
    if (isNaN(maxUse) || maxUse < 1 || maxUse > 5000 || !Number.isInteger(maxUse)) {
      errors.maxUsage = 'Tổng số lượt phát hành phải từ 1 đến 5000';
    }
  }

  if (userUsageLimit !== '') {
    const userLimit = Number(userUsageLimit);
    if (isNaN(userLimit) || userLimit < 1 || userLimit > 5 || !Number.isInteger(userLimit)) {
      errors.userUsageLimit = 'Lượt dùng tối đa / 1 khách hàng phải từ 1 đến 5';
    }
  }

  return errors;
};
