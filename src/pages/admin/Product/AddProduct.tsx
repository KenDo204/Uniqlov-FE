import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, TextField, Select, MenuItem, FormControl, 
  InputLabel, Switch, FormControlLabel, Card, 
  Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Radio, IconButton
} from '@mui/material';
import { Delete, ArrowBack, AddCircle, Refresh } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useProduct } from '@/hooks/useProduct';
import { useCategory } from '@/hooks/useCategory';
import ConfirmModal from '@/components/general/ConfirmModal';
import { Gender } from '@/types/enums/genderType';

interface TempOption {
  name: string; // e.g. "colorName" or "size"
  values: string[];
  rawInput: string; // Comma separated values
}

interface ImageInput {
  url: string;
  isThumbnail: boolean;
  displayOrder: number;
}

interface VariantInput {
  attributes: Record<string, string>;
  price: number;
  costPrice: number;
  stockQuantity: number;
  skuCode: string;
  variantImage: string;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { createProduct, isSubmitting } = useProduct();
  const { categories, fetchAdminCategories } = useCategory();

  // Navigation Guard / Form Dirty State
  const [isDirty, setIsDirty] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Form State - Basic Info
  const [productName, setProductName] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [targetGender, setTargetGender] = useState<Gender>(Gender.OTHER); // Unisex default
  const [maxOrderQuantity, setMaxOrderQuantity] = useState<number>(5);
  const [inPopular, setInPopular] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Form State - Shipping Info
  const [weightKg, setWeightKg] = useState<string>('0.2');
  const [lengthM, setLengthM] = useState<string>('0.2');
  const [widthM, setWidthM] = useState<string>('0.15');
  const [heightM, setHeightM] = useState<string>('0.05');

  // Form State - Images
  const [images, setImages] = useState<ImageInput[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Product Type: 'simple' | 'variable'
  const [productType, setProductType] = useState<'simple' | 'variable'>('simple');

  // Form State - Simple Product Pricing/Inventory (translated to single variant under the hood)
  const [simplePrice, setSimplePrice] = useState<string>('0');
  const [simpleCostPrice, setSimpleCostPrice] = useState<string>('0');
  const [simpleStock, setSimpleStock] = useState<string>('10');
  const [simpleSku, setSimpleSku] = useState<string>('');

  // Form State - Variable Product Options Config (Max 2 groups)
  const [options, setOptions] = useState<TempOption[]>([
    { name: 'colorName', values: [], rawInput: '' },
    { name: 'size', values: [], rawInput: '' }
  ]);
  const [variants, setVariants] = useState<VariantInput[]>([]);

  // Validation Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAdminCategories().catch(err => console.error('Error fetching categories:', err));
  }, [fetchAdminCategories]);

  // Alert on F5/tab close if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'Bạn có chắc chắn muốn rời đi? Mọi thông tin chưa lưu sẽ bị mất.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Flatten categories list to display in select and identify leaf nodes
  const flatCategoriesList = useMemo(() => {
    const list: { categoryId: number; categoryName: string; isLeaf: boolean; level: number }[] = [];
    const traverse = (nodes: any[], level = 0) => {
      for (const node of nodes) {
        const isLeaf = !node.children || node.children.length === 0;
        list.push({ 
          categoryId: node.categoryId, 
          categoryName: '— '.repeat(level) + node.categoryName, 
          isLeaf,
          level 
        });
        if (node.children && node.children.length > 0) {
          traverse(node.children, level + 1);
        }
      }
    };
    if (categories) traverse(categories);
    return list;
  }, [categories]);

  // Slug generator helper
  const handleNameChange = (val: string) => {
    setProductName(val);
    setIsDirty(true);
    // Auto generate slug from name
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .trim()
      .replace(/\s+/g, '-');
    setProductSlug(generatedSlug.slice(0, 100));
  };

  // Add Image URL helper
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (!newImageUrl.startsWith('http://') && !newImageUrl.startsWith('https://')) {
      toast.warning('Vui lòng nhập đường dẫn hình ảnh hợp lệ (bắt đầu bằng http hoặc https)');
      return;
    }
    const isFirst = images.length === 0;
    setImages([...images, {
      url: newImageUrl.trim(),
      isThumbnail: isFirst, // automatically set first image as thumbnail
      displayOrder: images.length
    }]);
    setNewImageUrl('');
    setIsDirty(true);
  };

  // Remove Image helper
  const handleRemoveImage = (index: number) => {
    const removed = images[index];
    const updated = images.filter((_, i) => i !== index);
    // If we removed the thumbnail, make the first remaining image the thumbnail
    if (removed.isThumbnail && updated.length > 0) {
      updated[0].isThumbnail = true;
    }
    setImages(updated);
    setIsDirty(true);
  };

  // Set thumbnail helper
  const handleSetThumbnail = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isThumbnail: i === index
    }));
    setImages(updated);
    setIsDirty(true);
  };

  // Generate Cartesian Product of variants
  const handleGenerateVariants = () => {
    // Process input raw values into arrays
    const processedOptions = options.map(opt => {
      const vals = opt.rawInput
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0);
      return {
        ...opt,
        values: vals
      };
    });

    // Check if at least one option name and value is defined
    const activeOptions = processedOptions.filter(o => o.name && o.values.length > 0);
    if (activeOptions.length === 0) {
      toast.warning('Vui lòng nhập thuộc tính và giá trị biến thể trước khi sinh!');
      return;
    }

    // Generate combinations
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
      toast.error(`Tổng số biến thể hiện tại là ${combos.length}. Nghiệp vụ quy định không vượt quá 50 biến thể.`);
      return;
    }

    // Keep values of existing matching variants if possible
    const newVariants = combos.map(combo => {
      const existing = variants.find(v => 
        Object.entries(combo).every(([k, val]) => v.attributes[k] === val)
      );
      
      return {
        attributes: combo,
        price: existing?.price || Number(simplePrice) || 500000,
        costPrice: existing?.costPrice || Number(simpleCostPrice) || 300000,
        stockQuantity: existing?.stockQuantity !== undefined ? existing.stockQuantity : 10,
        skuCode: existing?.skuCode || '',
        variantImage: existing?.variantImage || (images[0]?.url || '')
      };
    });

    setVariants(newVariants);
    setOptions(processedOptions);
    setIsDirty(true);
    toast.success(`Sinh tự động thành công ${newVariants.length} biến thể.`);
  };

  // Update variant field
  const handleUpdateVariant = (index: number, field: keyof VariantInput, value: any) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setVariants(updated);
    setIsDirty(true);
  };

  // Check if current variants list matches Cartesian combos of the options
  const checkCartesianMatch = (): boolean => {
    if (productType === 'simple') return true;

    // Process input options
    const processedOptions = options.map(opt => {
      const vals = opt.rawInput
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0);
      return {
        name: opt.name.trim(),
        values: vals
      };
    });

    const activeOptions = processedOptions.filter(o => o.name && o.values.length > 0);
    if (activeOptions.length === 0) return false;

    // Generate Cartesian combinations
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

    // Match each combination with existing variants
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

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Basic Info
    if (!productName.trim()) newErrors.productName = 'Tên sản phẩm bắt buộc nhập';
    else if (productName.length > 150) newErrors.productName = 'Tên sản phẩm không quá 150 ký tự';

    if (!categoryId) newErrors.categoryId = 'Danh mục bắt buộc chọn';
    else {
      // Check if selected category is a leaf node
      const cat = flatCategoriesList.find(c => c.categoryId === categoryId);
      if (cat && !cat.isLeaf) {
        newErrors.categoryId = 'Không thể chọn danh mục cha. Vui lòng chọn danh mục con cấp cuối.';
      }
    }

    if (maxOrderQuantity < 1 || maxOrderQuantity > 99) {
      newErrors.maxOrderQuantity = 'Số lượng đặt tối đa phải từ 1 đến 99';
    }

    // 2. Shipping
    const w = Number(weightKg);
    const l = Number(lengthM);
    const wi = Number(widthM);
    const h = Number(heightM);

    if (isNaN(w) || w <= 0) newErrors.weightKg = 'Khối lượng phải lớn hơn 0';
    if (isNaN(l) || l <= 0) newErrors.lengthM = 'Chiều dài phải lớn hơn 0';
    if (isNaN(wi) || wi <= 0) newErrors.widthM = 'Chiều rộng phải lớn hơn 0';
    if (isNaN(h) || h <= 0) newErrors.heightM = 'Chiều cao phải lớn hơn 0';

    // 3. Images
    if (images.length === 0) {
      newErrors.images = 'Bắt buộc phải có ít nhất 1 ảnh';
    } else {
      const thumbs = images.filter(img => img.isThumbnail);
      if (thumbs.length !== 1) {
        newErrors.images = 'Sản phẩm phải có đúng 1 ảnh đại diện (Thumbnail)';
      }
    }

    // 4. Variants pricing & inventory
    if (productType === 'simple') {
      const price = Number(simplePrice);
      const cost = Number(simpleCostPrice);
      const stock = Number(simpleStock);

      if (isNaN(price) || price <= 0) newErrors.simplePrice = 'Giá bán phải lớn hơn 0';
      if (isNaN(cost) || cost <= 0) newErrors.simpleCostPrice = 'Giá vốn phải lớn hơn 0';
      if (price < cost) newErrors.simplePrice = 'Giá bán không được nhỏ hơn giá vốn';
      if (isNaN(stock) || stock < -1) newErrors.simpleStock = 'Số lượng tồn kho phải >= -1';
    } else {
      // Variable product
      if (variants.length === 0) {
        newErrors.variants = 'Vui lòng định nghĩa thuộc tính và chọn Sinh biến thể';
      } else {
        // Validate options groups limit
        const activeOpts = options.filter(o => o.name && o.values.length > 0);
        if (activeOpts.length > 2) {
          newErrors.variants = 'Tối đa chỉ được cấu hình 2 nhóm thuộc tính (ví dụ: Màu sắc, Kích cỡ)';
        }

        // Validate variants count
        if (variants.length > 50) {
          newErrors.variants = 'Số lượng biến thể không vượt quá 50';
        }

        // Validate that variants list matches Cartesian combinations of the options
        if (!checkCartesianMatch()) {
          newErrors.variants = 'Danh sách biến thể không khớp với cấu hình thuộc tính đã chỉnh sửa. Vui lòng nhấn "Sinh lại tổ hợp biến thể" để đồng bộ.';
        }

        // Validate each variant fields
        variants.forEach((v, idx) => {
          if (v.price <= 0) {
            newErrors[`variant_price_${idx}`] = 'Giá bán phải > 0';
          }
          if (v.costPrice <= 0) {
            newErrors[`variant_cost_${idx}`] = 'Giá vốn phải > 0';
          }
          if (v.price < v.costPrice) {
            newErrors[`variant_price_${idx}`] = 'Giá bán phải >= Giá vốn';
          }
          if (v.stockQuantity < -1) {
            newErrors[`variant_stock_${idx}`] = 'Tồn kho phải >= -1';
          }
        });
      }
    }

    setErrors(newErrors);
    
    // Return true if no errors
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      const firstError = Object.values(newErrors)[0];
      toast.error(`Dữ liệu không hợp lệ: ${firstError}`);
    }
    return isValid;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Prepare tags
    const productTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Prepare images DTO
    const productImages = images.map(img => ({
      imageUrl: img.url,
      isThumbnail: img.isThumbnail,
      displayOrder: img.displayOrder
    }));

    // Prepare variants DTO
    let productVariants = [];
    let optionsConfigObj: Record<string, any> = {};

    if (productType === 'simple') {
      productVariants = [{
        price: Number(simplePrice),
        costPrice: Number(simpleCostPrice),
        variantAttributes: {},
        skuCode: simpleSku.trim() || undefined,
        stockQuantity: Number(simpleStock),
        variantImage: images.find(img => img.isThumbnail)?.url || images[0]?.url || ''
      }];
      optionsConfigObj = {};
    } else {
      productVariants = variants.map(v => ({
        price: v.price,
        costPrice: v.costPrice,
        variantAttributes: v.attributes,
        skuCode: v.skuCode.trim() || undefined,
        stockQuantity: v.stockQuantity,
        variantImage: v.variantImage.trim() || images.find(img => img.isThumbnail)?.url || images[0]?.url || ''
      }));

      // Prepare optionsConfig JSON object
      // Backend expects size list, color list
      const sizesOpt = options.find(o => o.name === 'size');
      const colorsOpt = options.find(o => o.name === 'colorName');

      optionsConfigObj = {
        sizes: sizesOpt ? sizesOpt.values : [],
        colors: colorsOpt ? colorsOpt.values.map(col => ({
          colorName: col,
          colorCode: '#8E8E93' // default hex or we can map dynamically
        })) : []
      };
    }

    const payload = {
      productName,
      productDescription,
      inPopular,
      targetGender,
      maxOrderQuantity,
      optionsConfig: JSON.stringify(optionsConfigObj),
      productTags,
      categoryId: Number(categoryId),
      weightKg: Number(weightKg),
      lengthM: Number(lengthM),
      widthM: Number(widthM),
      heightM: Number(heightM),
      variants: productVariants,
      images: productImages
    };

    try {
      await createProduct(payload);
      toast.success('Thêm mới sản phẩm thành công!');
      setIsDirty(false);
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err || 'Thêm sản phẩm thất bại');
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      navigate('/admin/products');
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* BACK HEADER */}
        <div className="flex items-center gap-3">
          <IconButton onClick={handleCancelClick} size="small" sx={{ bgcolor: 'white', border: '1px solid #e5e7eb' }}>
            <ArrowBack fontSize="small" />
          </IconButton>
          <div>
            <h1 className="text-xl font-bold text-gray-800 m-0">Thêm mới sản phẩm</h1>
            <p className="text-xs text-gray-400 m-0">Khai báo thông số sản phẩm mới, cấu hình thuộc tính và sinh các biến thể kho</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* CARD 1: THÔNG TIN CƠ BẢN */}
          <Card className="p-6 rounded-2xl shadow-sm border border-gray-150 space-y-6">
            <Typography variant="h6" className="font-bold text-gray-800" sx={{ mb: 1.5 }}>
              1. Thông tin cơ bản
            </Typography>

            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="Tên sản phẩm *"
                    variant="outlined"
                    fullWidth
                    value={productName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    error={!!errors.productName}
                    helperText={errors.productName || 'Không quá 150 ký tự'}
                    slotProps={{ htmlInput: { maxLength: 150 } }}
                    size="small"
                  />
                </div>

                <div>
                  <TextField
                    label="Slug mã sản phẩm"
                    variant="outlined"
                    fullWidth
                    value={productSlug || '(Tự động sinh bởi Backend)'}
                    slotProps={{ htmlInput: { readOnly: true } }}
                    size="small"
                    helperText="Slug chuẩn SEO do Backend tự động tạo và quản lý"
                    sx={{ bgcolor: '#f9fafb' }}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <FormControl fullWidth size="small" error={!!errors.categoryId}>
                    <InputLabel id="category-select-label">Danh mục sản phẩm *</InputLabel>
                    <Select
                      labelId="category-select-label"
                      value={categoryId}
                      label="Danh mục sản phẩm *"
                      onChange={(e) => { setCategoryId(e.target.value as number); setIsDirty(true); }}
                    >
                      <MenuItem value=""><em>-- Chọn danh mục --</em></MenuItem>
                      {flatCategoriesList.map(cat => (
                        <MenuItem 
                          key={cat.categoryId} 
                          value={cat.categoryId} 
                          disabled={!cat.isLeaf}
                          sx={{ pl: cat.level * 2 + 2 }}
                        >
                          {cat.categoryName} {!cat.isLeaf ? '(Mẹ - Khóa chọn)' : ''}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoryId && (
                      <Typography className="text-red-500 text-xs mt-1">{errors.categoryId}</Typography>
                    )}
                  </FormControl>
                </div>

                <div className="md:col-span-1">
                  <FormControl fullWidth size="small">
                    <InputLabel id="gender-select-label">Giới tính mục tiêu *</InputLabel>
                    <Select
                      labelId="gender-select-label"
                      value={targetGender}
                      label="Giới tính mục tiêu *"
                      onChange={(e) => { setTargetGender(e.target.value as Gender); setIsDirty(true); }}
                    >
                      <MenuItem value={Gender.MALE}>Nam</MenuItem>
                      <MenuItem value={Gender.FEMALE}>Nữ</MenuItem>
                      <MenuItem value={Gender.OTHER}>Unisex (Cả hai)</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="md:col-span-1">
                  <TextField
                    label="Số lượng mua tối đa/đơn *"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={maxOrderQuantity}
                    onChange={(e) => { setMaxOrderQuantity(Number(e.target.value)); setIsDirty(true); }}
                    error={!!errors.maxOrderQuantity}
                    helperText={errors.maxOrderQuantity || 'Giới hạn từ 1 đến 99'}
                    slotProps={{ htmlInput: { min: 1, max: 99 } }}
                    size="small"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="w-full">
                <TextField
                  label="Mô tả sản phẩm"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={productDescription}
                  onChange={(e) => { setProductDescription(e.target.value); setIsDirty(true); }}
                  helperText="Chi tiết chất liệu, xuất xứ và quy cách giặt là. Không quá 2000 ký tự."
                  slotProps={{ htmlInput: { maxLength: 2000 } }}
                />
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                  <TextField
                    label="Danh sách Tags (phân cách bằng dấu phẩy)"
                    variant="outlined"
                    fullWidth
                    value={tagsInput}
                    onChange={(e) => { setTagsInput(e.target.value); setIsDirty(true); }}
                    placeholder="e.g. vintage, polo, he-2026"
                    size="small"
                    helperText="Tags hỗ trợ phân loại sản phẩm nhanh"
                  />
                </div>

                <div className="md:col-span-1 flex items-center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={inPopular}
                        onChange={(e) => { setInPopular(e.target.checked); setIsDirty(true); }}
                        color="primary"
                      />
                    }
                    label="Sản phẩm thịnh hành (Popular)"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* CARD 2: VẬN CHUYỂN */}
          <Card className="p-6 rounded-2xl shadow-sm border border-gray-150 space-y-6">
            <Typography variant="h6" className="font-bold text-gray-800" sx={{ mb: 1.5 }}>
              2. Kích thước & Vận chuyển (Bắt buộc {'>'} 0)
            </Typography>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <TextField
                  label="Cân nặng (kg) *"
                  variant="outlined"
                  fullWidth
                  value={weightKg}
                  onChange={(e) => { setWeightKg(e.target.value); setIsDirty(true); }}
                  error={!!errors.weightKg}
                  helperText={errors.weightKg}
                  size="small"
                />
              </div>
              <div>
                <TextField
                  label="Chiều dài (mét) *"
                  variant="outlined"
                  fullWidth
                  value={lengthM}
                  onChange={(e) => { setLengthM(e.target.value); setIsDirty(true); }}
                  error={!!errors.lengthM}
                  helperText={errors.lengthM}
                  size="small"
                />
              </div>
              <div>
                <TextField
                  label="Chiều rộng (mét) *"
                  variant="outlined"
                  fullWidth
                  value={widthM}
                  onChange={(e) => { setWidthM(e.target.value); setIsDirty(true); }}
                  error={!!errors.widthM}
                  helperText={errors.widthM}
                  size="small"
                />
              </div>
              <div>
                <TextField
                  label="Chiều cao (mét) *"
                  variant="outlined"
                  fullWidth
                  value={heightM}
                  onChange={(e) => { setHeightM(e.target.value); setIsDirty(true); }}
                  error={!!errors.heightM}
                  helperText={errors.heightM}
                  size="small"
                />
              </div>
            </div>
          </Card>

          {/* CARD 3: HÌNH ẢNH */}
          <Card className="p-6 rounded-2xl shadow-sm border border-gray-150 space-y-6">
            <div>
              <Typography variant="h6" className="font-bold text-gray-800 m-0">
                3. Bộ sưu tập hình ảnh
              </Typography>
              <Typography variant="body2" className="text-xs text-gray-400 mt-1 m-0">
                Nhập đường dẫn hình ảnh trưng bày. Phải cấu hình duy nhất 1 ảnh làm Ảnh đại diện (Thumbnail).
              </Typography>
            </div>

            <div className="flex gap-2">
              <TextField
                label="Đường dẫn ảnh (URL) *"
                variant="outlined"
                fullWidth
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                size="small"
              />
              <Button 
                type="button"
                onClick={handleAddImage}
                variant="outlined"
                startIcon={<AddCircle />}
                sx={{ textTransform: 'none', color: '#00927c', borderColor: '#00927c', '&:hover': { borderColor: '#007c69', bgcolor: 'rgba(0,146,124,0.04)' } }}
              >
                Thêm
              </Button>
            </div>

            {errors.images && (
              <Typography className="text-red-500 text-xs">{errors.images}</Typography>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                    <img src={img.url} alt="Product upload" className="w-full h-32 object-cover" />
                    
                    <div className="p-2 flex flex-col gap-1.5 flex-1 justify-between">
                      <FormControlLabel
                        control={
                          <Radio
                            checked={img.isThumbnail}
                            onChange={() => handleSetThumbnail(idx)}
                            size="small"
                            color="success"
                          />
                        }
                        label={<span className="text-xs font-semibold text-gray-600">Ảnh bìa</span>}
                        className="m-0"
                      />
                      
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleRemoveImage(idx)}
                        size="small"
                        startIcon={<Delete />}
                        className="w-full text-[11px]"
                      >
                        Xóa bỏ
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* CARD 4: PHÂN LOẠI & BIẾN THỂ */}
          <Card className="p-6 rounded-2xl shadow-sm border border-gray-150 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <Typography variant="h6" className="font-bold text-gray-800 m-0">
                  4. Phân loại & Biến thể
                </Typography>
                <Typography variant="body2" className="text-xs text-gray-400 mt-0.5 m-0">
                  Sản phẩm đơn giản có giá bán chung. Sản phẩm biến thể sẽ sinh giá & kho theo Màu/Size.
                </Typography>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setProductType('simple'); setIsDirty(true); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                    productType === 'simple' ? 'bg-[#00927c] text-white shadow-sm' : 'text-gray-500 bg-transparent'
                  }`}
                >
                  Sản phẩm đơn giản
                </button>
                <button
                  type="button"
                  onClick={() => { setProductType('variable'); setIsDirty(true); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                    productType === 'variable' ? 'bg-[#00927c] text-white shadow-sm' : 'text-gray-500 bg-transparent'
                  }`}
                >
                  Nhiều biến thể
                </button>
              </div>
            </div>

            {productType === 'simple' ? (
              // SIMPLE PRODUCT FIELDS
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <TextField
                    label="Giá bán đề xuất (VND) *"
                    variant="outlined"
                    fullWidth
                    value={simplePrice}
                    onChange={(e) => { setSimplePrice(e.target.value); setIsDirty(true); }}
                    error={!!errors.simplePrice}
                    helperText={errors.simplePrice}
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Giá vốn sản phẩm (VND) *"
                    variant="outlined"
                    fullWidth
                    value={simpleCostPrice}
                    onChange={(e) => { setSimpleCostPrice(e.target.value); setIsDirty(true); }}
                    error={!!errors.simpleCostPrice}
                    helperText={errors.simpleCostPrice}
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Số lượng tồn kho *"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={simpleStock}
                    onChange={(e) => { setSimpleStock(e.target.value); setIsDirty(true); }}
                    error={!!errors.simpleStock}
                    helperText={errors.simpleStock || '-1 nghĩa là Vô hạn'}
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Mã SKU (tự sinh nếu bỏ trống)"
                    variant="outlined"
                    fullWidth
                    value={simpleSku}
                    onChange={(e) => { setSimpleSku(e.target.value); setIsDirty(true); }}
                    size="small"
                  />
                </div>
              </div>
            ) : (
              // VARIABLE PRODUCT ATTRIBUTE AND COMBINATIONS
              <div className="space-y-6">
                
                {/* Options Setup */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 space-y-4">
                  <div className="flex justify-between items-center">
                    <Typography variant="subtitle2" className="font-bold text-gray-700" sx={{ mb: 1.5 }}>
                      Thiết lập nhóm thuộc tính (Tối đa 2 nhóm)
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {options.map((opt, idx) => (
                      <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-3" key={idx}>
                        <Typography variant="caption" className="font-bold text-[#00927c] block" sx={{ mb: 1.5 }}>
                          NHÓM THUỘC TÍNH {idx + 1}
                        </Typography>
                        
                        <TextField
                          label="Tên thuộc tính (e.g. colorName, size)"
                          variant="outlined"
                          fullWidth
                          value={opt.name}
                          onChange={(e) => {
                            const updated = [...options];
                            updated[idx].name = e.target.value;
                            setOptions(updated);
                            setIsDirty(true);
                          }}
                          placeholder={idx === 0 ? 'colorName' : 'size'}
                          size="small"
                          helperText="Khuyên dùng 'colorName' cho màu sắc và 'size' cho kích thước"
                          sx={{ mb: 1.5 }}
                        />

                        <TextField
                          label="Các giá trị (phân cách bằng dấu phẩy)"
                          variant="outlined"
                          fullWidth
                          value={opt.rawInput}
                          onChange={(e) => {
                            const updated = [...options];
                            updated[idx].rawInput = e.target.value;
                            setOptions(updated);
                            setIsDirty(true);
                          }}
                          placeholder={idx === 0 ? 'Đen, Trắng, Navy' : 'S, M, L, XL'}
                          size="small"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button 
                      type="button"
                      variant="contained" 
                      onClick={handleGenerateVariants}
                      startIcon={<Refresh />}
                      sx={{ bgcolor: '#00927c', textTransform: 'none', px: 3, py: 1, borderRadius: '10px', boxShadow: 'none', '&:hover': { bgcolor: '#007c69', boxShadow: 'none' } }}
                    >
                      Sinh tổ hợp biến thể
                    </Button>
                  </div>
                </div>

                {errors.variants && (
                  <Typography className="text-red-500 text-xs" sx={{ mb: 1.5 }}>{errors.variants}</Typography>
                )}

                {/* Variants List Table */}
                {variants.length > 0 && (
                  <div className="space-y-2">
                    <Typography variant="subtitle2" className="font-bold text-gray-700" sx={{ mb: 1.5 }}>
                      Danh sách biến thể đã sinh ({variants.length})
                    </Typography>

                    <TableContainer component={Paper} className="border border-gray-200 rounded-xl overflow-hidden shadow-none">
                      <Table size="small">
                        <TableHead className="bg-gray-50">
                          <TableRow>
                            <TableCell className="font-bold text-gray-600">Thuộc tính</TableCell>
                            <TableCell className="font-bold text-gray-600 w-44">Giá bán *</TableCell>
                            <TableCell className="font-bold text-gray-600 w-44">Giá vốn *</TableCell>
                            <TableCell className="font-bold text-gray-600 w-28">Tồn kho *</TableCell>
                            <TableCell className="font-bold text-gray-600">Mã SKU</TableCell>
                            <TableCell className="font-bold text-gray-600">Ảnh URL</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {variants.map((v, idx) => (
                            <TableRow key={idx} className="hover:bg-gray-50">
                              <TableCell className="py-3">
                                <div className="flex gap-1 flex-wrap">
                                  {Object.entries(v.attributes).map(([key, val]) => (
                                    <span key={key} className="bg-gray-100 border border-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                      {key === 'colorName' ? 'Màu' : (key === 'size' ? 'Size' : key)}: {val}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={v.price}
                                  onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                                  error={!!errors[`variant_price_${idx}`]}
                                  helperText={errors[`variant_price_${idx}`]}
                                  size="small"
                                  slotProps={{ htmlInput: { min: 0 } }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={v.costPrice}
                                  onChange={(e) => handleUpdateVariant(idx, 'costPrice', Number(e.target.value))}
                                  error={!!errors[`variant_cost_${idx}`]}
                                  helperText={errors[`variant_cost_${idx}`]}
                                  size="small"
                                  slotProps={{ htmlInput: { min: 0 } }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={v.stockQuantity}
                                  onChange={(e) => handleUpdateVariant(idx, 'stockQuantity', Number(e.target.value))}
                                  error={!!errors[`variant_stock_${idx}`]}
                                  helperText={errors[`variant_stock_${idx}`] || '>= -1'}
                                  size="small"
                                  slotProps={{ htmlInput: { min: -1 } }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={v.skuCode}
                                  onChange={(e) => handleUpdateVariant(idx, 'skuCode', e.target.value)}
                                  placeholder="Auto"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={v.variantImage}
                                  onChange={(e) => handleUpdateVariant(idx, 'variantImage', e.target.value)}
                                  placeholder="Link ảnh"
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* SUBMIT ACTIONS */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={handleCancelClick}
              variant="outlined"
              sx={{ textTransform: 'none', px: 4, py: 1.2, fontWeight: 'bold', borderRadius: '12px', borderColor: '#d1d5db', color: '#4b5563', '&:hover': { bgcolor: '#f3f4f6', borderColor: '#9ca3af' } }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              sx={{ bgcolor: '#00927c', textTransform: 'none', px: 6, py: 1.2, fontWeight: 'bold', borderRadius: '12px', boxShadow: 'none', '&:hover': { bgcolor: '#007c69', boxShadow: 'none' } }}
            >
              {isSubmitting ? 'Đang tạo sản phẩm...' : 'Lưu sản phẩm'}
            </Button>
          </div>

        </form>
      </div>

      {/* CONFIRM BACK MODAL */}
      <ConfirmModal
        open={isCancelModalOpen}
        setOpen={setIsCancelModalOpen}
        title="Rời khỏi trang?"
        content="Bạn có các thay đổi chưa được lưu lại. Bạn có chắc chắn muốn hủy bỏ và quay lại danh sách sản phẩm không?"
        onConfirm={() => {
          setIsDirty(false);
          setIsCancelModalOpen(false);
          navigate('/admin/products');
        }}
        confirmText="Rời đi"
        cancelText="Ở lại"
      />
    </div>
  );
}
