import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, TextField, Select, MenuItem, FormControl,
  InputLabel, Switch, FormControlLabel, Card,
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Radio, IconButton, CircularProgress
} from '@mui/material';
import { Delete, ArrowBack, AddCircle, Refresh } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useProduct } from '@/hooks/useProduct';
import { useCategory } from '@/hooks/useCategory';
import ConfirmModal from '@/components/general/ConfirmModal';
import Level3CategoryPicker from '@/components/admin/Category/Level3CategoryPicker';
import { Gender } from '@/types/enums/genderType';
import { uploadService } from '@/services/uploadService';
import { useUpload } from '@/hooks/useUpload';
import { CloudUpload } from '@mui/icons-material';
import { VariantDefaultInputs } from '@/components/admin/Product/VariantDefaultInputs';

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
  price: string;
  costPrice: string;
  stockQuantity: string;
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
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [categoryPathText, setCategoryPathText] = useState('');
  const [targetGender, setTargetGender] = useState<Gender>(Gender.UNISEX); // Unisex default
  const [maxOrderQuantity, setMaxOrderQuantity] = useState<string>('5');
  const [inPopular, setInPopular] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Form State - Shipping Info
  const [weightKg, setWeightKg] = useState<string>('0.2');
  const [lengthM, setLengthM] = useState<string>('0.2');
  const [widthM, setWidthM] = useState<string>('0.15');
  const [heightM, setHeightM] = useState<string>('0.05');

  // Form State - Images
  const [images, setImages] = useState<ImageInput[]>([]);

  // Product Type: 'simple' | 'variable'
  const [productType, setProductType] = useState<'simple' | 'variable'>('simple');

  // Form State - Simple Product Pricing/Inventory (translated to single variant under the hood)
  const [simplePrice, setSimplePrice] = useState<string>('0');
  const [simpleCostPrice, setSimpleCostPrice] = useState<string>('0');
  const [simpleStock, setSimpleStock] = useState<string>('10');

  // Form State - Variable Product Options Config (Max 2 groups)
  const [options, setOptions] = useState<TempOption[]>([
    { name: 'color', values: [], rawInput: '' },
    { name: 'size', values: [], rawInput: '' }
  ]);
  const [variants, setVariants] = useState<VariantInput[]>([]);

  // Form State - Default Variant Values
  const [defaultVariantPrice, setDefaultVariantPrice] = useState<string>('');
  const [defaultVariantCostPrice, setDefaultVariantCostPrice] = useState<string>('');
  const [defaultVariantStock, setDefaultVariantStock] = useState<string>('');
  
  // Form State - Color Images
  const [colorImages, setColorImages] = useState<Record<string, string>>({});

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

  const VariantImageCell = ({ imageUrl, onUpdate }: { imageUrl: string; onUpdate: (url: string) => void }) => {
    const { isUploading, uploadFile } = useUpload(uploadService.uploadProductImage);
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = await uploadFile(file);
      if (url) {
        onUpdate(url);
      }
      e.target.value = '';
    };

    const handleDelete = () => {
      // NOTE: If a Backend API for deleting uploaded files is available,
      // it should be called here. Currently, we only remove it from the Frontend state.
      onUpdate('');
    };

    return (
      <div className="flex items-center gap-1.5">
        {imageUrl ? (
          <div className="relative w-10 h-10 border border-gray-200 rounded overflow-hidden shadow-sm shrink-0">
            <img src={imageUrl} alt="variant" className="w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <CircularProgress size={16} sx={{ color: 'white' }} />
              </div>
            )}
          </div>
        ) : null}
        <Button
          component="label"
          variant="outlined"
          size="small"
          disabled={isUploading}
          sx={{ minWidth: 0, p: '6px', borderColor: '#e5e7eb', color: '#6b7280', '&:hover': { borderColor: 'var(--color-theme)', color: 'var(--color-theme)', bgcolor: '#f0fdfa' } }}
          title={imageUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
        >
          {isUploading && !imageUrl ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : <CloudUpload fontSize="small" />}
          <input type="file" hidden accept="image/*" onChange={handleUpload} />
        </Button>
        {imageUrl && (
          <IconButton
            size="small"
            color="error"
            onClick={handleDelete}
            disabled={isUploading}
            sx={{ p: '5px', border: '1px solid #fee2e2', borderRadius: '4px', '&:hover': { bgcolor: '#fef2f2' } }}
            title="Xóa ảnh"
          >
            <Delete fontSize="small" />
          </IconButton>
        )}
      </div>
    );
  };

  // Add Image URL helper
  const { isUploading: isUploadingImage, uploadFile } = useUpload(uploadService.uploadProductImage);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file);
    if (url) {
      const isFirst = images.length === 0;
      setImages([...images, {
        url: url,
        isThumbnail: isFirst,
        displayOrder: images.length
      }]);
      setIsDirty(true);
      toast.success('Tải ảnh lên thành công!');
    }
    event.target.value = '';
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

      if (existing) {
        return {
          ...existing,
          attributes: combo
        };
      }

      const vColor = combo['color'] || combo['colorName'];
      return {
        attributes: combo,
        price: defaultVariantPrice,
        costPrice: defaultVariantCostPrice,
        stockQuantity: defaultVariantStock || '10',
        skuCode: '',
        variantImage: (vColor && colorImages[vColor]) || (images[0]?.url || '')
      };
    });

    setVariants(newVariants);
    setOptions(processedOptions);
    setIsDirty(true);
    toast.success(`Sinh tự động thành công ${newVariants.length} biến thể.`);
  };

  const handleUpdateVariant = (index: number, field: keyof VariantInput, value: any) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setVariants(updated);
    setIsDirty(true);
  };

  // Derived unique colors from variants
  const uniqueColors = useMemo(() => {
    const colors = new Set<string>();
    variants.forEach(v => {
      const color = v.attributes['color'] || v.attributes['colorName'];
      if (color) colors.add(color);
    });
    return Array.from(colors);
  }, [variants]);

  const handleColorImageUpdate = (color: string, url: string) => {
    setColorImages(prev => ({ ...prev, [color]: url }));
    // Auto update variants that match this color
    setVariants(prev => prev.map(v => {
      const vColor = v.attributes['color'] || v.attributes['colorName'];
      if (vColor === color) {
        return { ...v, variantImage: url };
      }
      return v;
    }));
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

    const parsedMaxOrderQuantity = Number(maxOrderQuantity);
    if (isNaN(parsedMaxOrderQuantity) || parsedMaxOrderQuantity < 1 || parsedMaxOrderQuantity > 99) {
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
          const vPrice = Number(v.price) || 0;
          const vCost = Number(v.costPrice) || 0;
          const vStock = Number(v.stockQuantity) || 0;

          if (vPrice <= 0) {
            newErrors[`variant_price_${idx}`] = 'Giá bán phải > 0';
          }
          if (vCost <= 0) {
            newErrors[`variant_cost_${idx}`] = 'Giá vốn phải > 0';
          }
          if (vPrice < vCost) {
            newErrors[`variant_price_${idx}`] = 'Giá bán phải >= Giá vốn';
          }
          if (vStock < -1) {
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
        stockQuantity: Number(simpleStock),
        variantImage: images.find(img => img.isThumbnail)?.url || images[0]?.url || ''
      }];
      optionsConfigObj = {};
    } else {
      productVariants = variants.map(v => ({
        price: v.price === '' ? 0 : Number(v.price),
        costPrice: v.costPrice === '' ? 0 : Number(v.costPrice),
        variantAttributes: v.attributes,
        stockQuantity: v.stockQuantity === '' ? 0 : Number(v.stockQuantity),
        variantImage: v.variantImage.trim() || images.find(img => img.isThumbnail)?.url || images[0]?.url || ''
      }));

      // Prepare optionsConfig JSON object
      // Backend expects size list, color list
      const sizesOpt = options.find(o => o.name === 'size');
      const colorsOpt = options.find(o => o.name === 'color');

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
      maxOrderQuantity: Number(maxOrderQuantity),
      optionsConfig: optionsConfigObj,
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
    <div className="w-full text-left flex flex-col gap-6">
      <div className="w-full mx-auto space-y-6">

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
                  <TextField
                    label="Danh mục sản phẩm *"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={categoryPathText || 'Chưa chọn danh mục'}
                    onClick={() => setIsCategoryPickerOpen(true)}
                    error={!!errors.categoryId}
                    helperText={errors.categoryId || 'Nhấn để chọn danh mục cấp 3'}
                    slotProps={{
                      htmlInput: { readOnly: true, style: { cursor: 'pointer' } }
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                         cursor: 'pointer',
                         bgcolor: '#f9fafb'
                      }
                    }}
                  />
                  <Level3CategoryPicker
                    open={isCategoryPickerOpen}
                    onClose={() => setIsCategoryPickerOpen(false)}
                    categoryTree={categories || []}
                    onConfirm={(id, pathText) => {
                      setCategoryId(id);
                      setCategoryPathText(pathText);
                      setIsDirty(true);
                    }}
                  />
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
                      <MenuItem value={Gender.UNISEX}>Unisex (Cả hai)</MenuItem>
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
                    onChange={(e) => { setMaxOrderQuantity(e.target.value); setIsDirty(true); }}
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
              <Button
                component="label"
                variant="outlined"
                startIcon={<AddCircle />}
                disabled={isUploadingImage}
                sx={{ textTransform: 'none', color: 'var(--color-theme)', borderColor: 'var(--color-theme)', '&:hover': { borderColor: 'var(--color-theme-hover)', bgcolor: 'rgba(0,146,124,0.04)' } }}
              >
                {isUploadingImage ? 'Đang tải lên...' : 'Tải ảnh lên'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileUpload}
                />
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
                  Sản phẩm đơn giản có giá bán chung. Sản phẩm biến thể sẽ sinh giá & kho theo Màu/Kích thước.
                </Typography>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setProductType('simple'); setIsDirty(true); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${productType === 'simple' ? 'bg-theme text-white shadow-sm' : 'text-gray-500 bg-transparent'
                    }`}
                >
                  Sản phẩm đơn giản
                </button>
                <button
                  type="button"
                  onClick={() => { setProductType('variable'); setIsDirty(true); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${productType === 'variable' ? 'bg-theme text-white shadow-sm' : 'text-gray-500 bg-transparent'
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
                    helperText={errors.simpleStock}
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
                        <Typography variant="caption" className="font-bold text-theme block" sx={{ mb: 1.5 }}>
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
                          helperText="Khuyên dùng 'color' cho màu sắc và 'size' cho kích thước"
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

                  <VariantDefaultInputs
                    price={defaultVariantPrice}
                    setPrice={setDefaultVariantPrice}
                    costPrice={defaultVariantCostPrice}
                    setCostPrice={setDefaultVariantCostPrice}
                    stock={defaultVariantStock}
                    setStock={setDefaultVariantStock}
                    onDirty={() => setIsDirty(true)}
                  />

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="contained"
                      onClick={handleGenerateVariants}
                      startIcon={<Refresh />}
                      sx={{ bgcolor: 'var(--color-theme)', textTransform: 'none', px: 3, py: 1, borderRadius: '10px', boxShadow: 'none', '&:hover': { bgcolor: '#007c69', boxShadow: 'none' } }}
                    >
                      Sinh tổ hợp biến thể
                    </Button>
                  </div>
                </div>

                {errors.variants && (
                  <Typography className="text-red-500 text-xs" sx={{ mb: 1.5 }}>{errors.variants}</Typography>
                )}

                {/* Color Images Setup */}
                {uniqueColors.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 space-y-4">
                    <div>
                      <Typography variant="subtitle2" className="font-bold text-gray-700 m-0">
                        Hình ảnh theo màu sắc
                      </Typography>
                      <Typography variant="body2" className="text-xs text-gray-400 mt-0.5 m-0">
                        Tải lên một ảnh cho mỗi màu. Hệ thống sẽ tự động áp dụng ảnh này cho tất cả biến thể của màu tương ứng.
                      </Typography>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uniqueColors.map(color => {
                        const sizes = variants
                          .filter(v => (v.attributes['color'] || v.attributes['colorName']) === color && v.attributes['size'])
                          .map(v => v.attributes['size']);
                        
                        return (
                          <div key={color} className="p-3 bg-white border border-gray-200 rounded-xl space-y-3 flex flex-col items-center text-center">
                            <Typography variant="subtitle2" className="font-bold text-gray-800">
                              Màu {color}
                            </Typography>
                            
                            <VariantImageCell 
                              imageUrl={colorImages[color] || ''} 
                              onUpdate={(url) => handleColorImageUpdate(color, url)} 
                            />

                            {sizes.length > 0 && (
                              <div className="text-[11px] text-gray-500 bg-gray-50 px-2 py-1.5 rounded w-full">
                                <span className="block font-semibold mb-1">Áp dụng cho:</span>
                                <div className="flex flex-wrap gap-1 justify-center">
                                  {sizes.map(s => (
                                    <span key={s} className="bg-white border border-gray-200 px-1 rounded text-[10px]">
                                      ✓ {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Variants List Table */}
                {variants.length > 0 && (
                  <div className="space-y-2">
                    <Typography variant="subtitle2" className="font-bold text-gray-700" sx={{ mb: 1.5 }}>
                      Danh sách biến thể đã sinh ({variants.length})
                    </Typography>

                    <TableContainer component={Paper} className="border border-gray-200 rounded-xl overflow-hidden shadow-none">
                      <Table size="small" className="whitespace-nowrap">
                        <TableHead className="bg-gray-50">
                          <TableRow>
                            <TableCell className="font-bold text-gray-600">Thuộc tính</TableCell>
                            <TableCell className="font-bold text-gray-600 w-44">Giá bán *</TableCell>
                            <TableCell className="font-bold text-gray-600 w-44">Giá vốn *</TableCell>
                            <TableCell className="font-bold text-gray-600 w-28">Tồn kho *</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {variants.map((v, idx) => (
                            <TableRow key={idx} className="hover:bg-gray-50">
                              <TableCell className="py-3">
                                <div className="flex gap-1 flex-wrap">
                                  {Object.entries(v.attributes).map(([key, val]) => (
                                    <span key={key} className="bg-gray-100 border border-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                      {key === 'color' ? 'Màu' : (key === 'size' ? 'Size' : key)}: {val}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={v.price}
                                  onChange={(e) => handleUpdateVariant(idx, 'price', e.target.value)}
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
                                  onChange={(e) => handleUpdateVariant(idx, 'costPrice', e.target.value)}
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
                                  onChange={(e) => handleUpdateVariant(idx, 'stockQuantity', e.target.value)}
                                  error={!!errors[`variant_stock_${idx}`]}
                                  helperText={errors[`variant_stock_${idx}`] || '>= -1'}
                                  size="small"
                                  slotProps={{ htmlInput: { min: -1 } }}
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
              sx={{ bgcolor: 'var(--color-theme)', textTransform: 'none', px: 6, py: 1.2, fontWeight: 'bold', borderRadius: '12px', boxShadow: 'none', '&:hover': { bgcolor: '#007c69', boxShadow: 'none' } }}
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
