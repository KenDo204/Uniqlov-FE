export interface TempOption {
  name: string; // e.g. "colorName" or "size"
  values: string[];
  rawInput: string; // Comma separated values
}

export interface VariantInput {
  attributes: Record<string, string>;
  price: string;
  costPrice: string;
  stockQuantity: string;
  skuCode: string;
  variantImage: string;
}

export interface GenerateVariantsParams {
  options: TempOption[];
  existingVariants: VariantInput[];
  defaultPrice: string;
  defaultCostPrice: string;
  defaultStock: string;
  colorImages: Record<string, string>;
  fallbackImageUrl?: string;
}

export interface GenerateVariantsResult {
  processedOptions: TempOption[];
  newVariants: VariantInput[];
  count: number;
  error?: string;
  warning?: string;
}

/**
 * Generate Cartesian combinations of options and map values.
 * When regenerating, if default inputs (price, costPrice, stock) are provided,
 * existing variants will also have their default fields updated to the newly provided default inputs.
 */
export const generateVariantCombinations = ({
  options,
  existingVariants,
  defaultPrice,
  defaultCostPrice,
  defaultStock,
  colorImages,
  fallbackImageUrl = ''
}: GenerateVariantsParams): GenerateVariantsResult => {
  // 1. Process rawInput into values
  const processedOptions = options.map(opt => {
    const vals = opt.rawInput
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);
    return {
      ...opt,
      name: opt.name.trim(),
      values: vals
    };
  });

  const activeOptions = processedOptions.filter(o => o.name && o.values.length > 0);
  if (activeOptions.length === 0) {
    return {
      processedOptions,
      newVariants: [],
      count: 0,
      warning: 'Vui lòng nhập thuộc tính và giá trị biến thể trước khi sinh!'
    };
  }

  // 2. Generate Cartesian Product combinations
  let combos: Record<string, string>[] = [{}];
  for (const opt of activeOptions) {
    const nextCombos: Record<string, string>[] = [];
    for (const current of combos) {
      for (const val of opt.values) {
        nextCombos.push({
          ...current,
          [opt.name]: val
        });
      }
    }
    combos = nextCombos;
  }

  if (combos.length > 50) {
    return {
      processedOptions,
      newVariants: existingVariants,
      count: combos.length,
      error: `Tổng số biến thể hiện tại là ${combos.length}. Nghiệp vụ quy định không vượt quá 50 biến thể.`
    };
  }

  // 3. Map combinations into variant objects
  const newVariants: VariantInput[] = combos.map(combo => {
    const existing = existingVariants.find(v => {
      const vAttrs = v.attributes || {};
      const comboEntries = Object.entries(combo);
      const varEntries = Object.entries(vAttrs);
      if (comboEntries.length !== varEntries.length) return false;
      return comboEntries.every(([k, val]) => vAttrs[k] === val);
    });

    const vColor = combo['color'] || combo['colorName'];
    const colorImg = vColor ? colorImages[vColor] : undefined;

    if (existing) {
      return {
        ...existing,
        attributes: combo,
        price: defaultPrice.trim() !== '' ? defaultPrice : existing.price,
        costPrice: defaultCostPrice.trim() !== '' ? defaultCostPrice : existing.costPrice,
        stockQuantity: defaultStock.trim() !== '' ? defaultStock : existing.stockQuantity,
        variantImage: colorImg || existing.variantImage || fallbackImageUrl
      };
    }

    return {
      attributes: combo,
      price: defaultPrice.trim() !== '' ? defaultPrice : '',
      costPrice: defaultCostPrice.trim() !== '' ? defaultCostPrice : '',
      stockQuantity: defaultStock.trim() !== '' ? defaultStock : '10',
      skuCode: '',
      variantImage: colorImg || fallbackImageUrl
    };
  });

  return {
    processedOptions,
    newVariants,
    count: newVariants.length
  };
};

/**
 * Check if the variants list matches Cartesian combinations of current options
 */
export const checkCartesianMatch = (
  productType: 'simple' | 'variable',
  options: TempOption[],
  variants: VariantInput[]
): boolean => {
  if (productType === 'simple') return true;

  const processedOptions = options.map(opt => ({
    name: opt.name.trim(),
    values: opt.rawInput
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0)
  }));

  const activeOptions = processedOptions.filter(o => o.name && o.values.length > 0);
  if (activeOptions.length === 0) return false;

  let combos: Record<string, string>[] = [{}];
  for (const opt of activeOptions) {
    const nextCombos: Record<string, string>[] = [];
    for (const current of combos) {
      for (const val of opt.values) {
        nextCombos.push({
          ...current,
          [opt.name]: val
        });
      }
    }
    combos = nextCombos;
  }

  if (combos.length !== variants.length) return false;

  return combos.every(combo => {
    return variants.some(v => {
      const variantAttr = v.attributes || {};
      const comboEntries = Object.entries(combo);
      const varEntries = Object.entries(variantAttr);
      if (comboEntries.length !== varEntries.length) return false;
      return comboEntries.every(([k, val]) => variantAttr[k] === val);
    });
  });
};
