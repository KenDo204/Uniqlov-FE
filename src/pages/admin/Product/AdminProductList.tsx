import React, { useState, useEffect, useMemo } from 'react';
import { 
  CircularProgress, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, IconButton
} from '@mui/material';
import { 
  Search, Delete, Visibility, CheckCircle, ErrorOutlined
} from '@mui/icons-material';
import ConfirmModal from '@/components/general/ConfirmModal';
import { useProduct } from '@/hooks/useProduct';
import { useCategory } from '@/hooks/useCategory';
import { toast } from 'react-toastify';
import type { ProductResponse } from '@/types/product';

const AdminProductList: React.FC = () => {
  const { 
    products, 
    isFetching: loading, 
    fetchAdminProducts, 
    deleteProduct 
  } = useProduct();

  const { categories, fetchAdminCategories } = useCategory();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  // Modals state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  
  // Delete confirm modal state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminProducts().catch(err => {
      console.error('Error fetching admin products:', err);
      toast.error('Lỗi tải danh sách sản phẩm');
    });
    fetchAdminCategories().catch(err => {
      console.error('Error fetching categories:', err);
    });
  }, [fetchAdminProducts, fetchAdminCategories]);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getGenderLabel = (gender: number) => {
    if (gender === 0) return 'Nữ';
    if (gender === 1) return 'Nam';
    return 'Unisex';
  };

  // Find category name by ID
  const getCategoryName = (catId: number) => {
    if (!categories) return 'Không xác định';
    
    const findInTree = (nodes: any[]): string | null => {
      for (const node of nodes) {
        if (node.categoryId === catId) return node.categoryName;
        if (node.children && node.children.length > 0) {
          const name = findInTree(node.children);
          if (name) return name;
        }
      }
      return null;
    };
    
    return findInTree(categories) || 'Không xác định';
  };

  // Compute price range helper
  const getPriceRange = (product: ProductResponse) => {
    if (!product.variants || product.variants.length === 0) return 'Chưa định giá';
    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) return formatCurrency(minPrice);
    return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
  };

  // Compute total stock helper
  const getTotalStock = (product: ProductResponse) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  };

  // Handle Delete Click
  const handleDeleteClick = (productId: number) => {
    setProductToDelete(productId);
    setIsDeleteConfirmOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete);
      toast.success('Xóa sản phẩm thành công!');
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
      fetchAdminProducts();
    } catch (error: any) {
      toast.error(error || 'Xóa sản phẩm thất bại');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      const matchesSearch = p.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.productSlug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === '' || p.categoryId === Number(categoryFilter);
      const matchesGender = genderFilter === '' || p.targetGender === Number(genderFilter);
      
      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [products, searchTerm, categoryFilter, genderFilter]);

  // Flattened category tree for dropdown selection
  const flatCategoriesList = useMemo(() => {
    const list: { categoryId: number; categoryName: string; level: number }[] = [];
    const traverse = (nodes: any[], level = 0) => {
      for (const node of nodes) {
        list.push({ 
          categoryId: node.categoryId, 
          categoryName: '— '.repeat(level) + node.categoryName, 
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

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý sản phẩm</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Xem toàn bộ danh mục sản phẩm của hệ thống, kiểm soát kho hàng và các cửa hàng</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3.5 text-gray-400" fontSize="small" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên sản phẩm hoặc slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#00927c] transition-colors text-[14px]"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#00927c] transition-colors bg-white text-[14px] flex-1 md:flex-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {flatCategoriesList.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#00927c] transition-colors bg-white text-[14px] flex-1 md:flex-none cursor-pointer"
            >
              <option value="">Tất cả giới tính</option>
              <option value="1">Nam</option>
              <option value="0">Nữ</option>
              <option value="2">Unisex</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold w-24">Hình ảnh</th>
                  <th className="px-6 py-4 font-semibold">Tên sản phẩm</th>
                  <th className="px-6 py-4 font-semibold">Danh mục</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap">Giới tính</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap">Giá tiền</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap">Tồn kho</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <CircularProgress size={32} sx={{ color: '#00927c' }} />
                      <p className="mt-2 text-gray-500 m-0">Đang tải danh sách sản phẩm...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => {
                    const thumbImg = prod.images?.find(img => img.isThumbnail) || prod.images?.[0];
                    const totalStock = getTotalStock(prod);
                    return (
                      <tr key={prod.productId} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <img 
                            src={thumbImg?.imageUrl || 'https://via.placeholder.com/80'} 
                            alt={prod.productName} 
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-800 leading-snug">{prod.productName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">ID: {prod.productId} | SKU: {prod.productSlug}</div>
                        </td>
                        <td className="px-6 py-4">{getCategoryName(prod.categoryId)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                            ${prod.targetGender === 1 ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                              prod.targetGender === 0 ? 'bg-pink-50 text-pink-700 border-pink-100' : 
                              'bg-gray-50 text-gray-700 border-gray-100'}`}
                          >
                            {getGenderLabel(prod.targetGender)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-gray-800">
                          {getPriceRange(prod)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-bold ${totalStock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                            {totalStock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border
                            ${prod.inStock 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-red-50 text-red-700 border-red-100'}`}
                          >
                            {prod.inStock ? (
                              <>
                                <CheckCircle className="text-emerald-500" sx={{ fontSize: 13 }} />
                                Mở bán
                              </>
                            ) : (
                              <>
                                <ErrorOutlined className="text-red-500" sx={{ fontSize: 13 }} />
                                Ngừng bán
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Tooltip title="Xem chi tiết sản phẩm" arrow>
                              <IconButton 
                                onClick={() => {
                                  setSelectedProduct(prod);
                                  setIsDetailOpen(true);
                                }}
                                size="small"
                                sx={{ color: '#00927c', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa/Khóa sản phẩm" arrow>
                              <IconButton 
                                onClick={() => handleDeleteClick(prod.productId)}
                                size="small"
                                sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50 mb-4" />
                        <p className="text-gray-500 font-medium m-0">Không tìm thấy sản phẩm nào</p>
                        <p className="text-gray-400 text-sm mt-1 m-0">Thay đổi bộ lọc tìm kiếm hoặc từ khóa của bạn.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      <Dialog 
        open={isDetailOpen} 
        onClose={() => { setIsDetailOpen(false); }}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
      >
        <DialogTitle className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 pt-4 px-6 m-0">
          Chi tiết sản phẩm quản trị
        </DialogTitle>
        
        <DialogContent className="pt-6 pb-6 px-6 max-h-[75vh] overflow-y-auto">
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Info Summary */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/3 max-w-[200px]">
                  <img 
                    src={selectedProduct.images?.find(img => img.isThumbnail)?.imageUrl || selectedProduct.images?.[0]?.imageUrl || 'https://via.placeholder.com/200'} 
                    alt={selectedProduct.productName} 
                    className="w-full h-auto object-cover rounded-xl border border-gray-100"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 m-0">{selectedProduct.productName}</h2>
                    <p className="text-xs text-gray-400 mt-1 m-0">Slug: {selectedProduct.productSlug} | ID: {selectedProduct.productId}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 block mb-0.5">Danh mục</span>
                      <span className="font-semibold text-gray-700">{getCategoryName(selectedProduct.categoryId)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">Đối tượng</span>
                      <span className="font-semibold text-gray-700">{getGenderLabel(selectedProduct.targetGender)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">Trạng thái kho</span>
                      <span className={`font-semibold ${selectedProduct.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                        {selectedProduct.inStock ? 'Còn hoạt động' : 'Tạm ngừng bán'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">Ngày tạo</span>
                      <span className="font-semibold text-gray-700">{new Date(selectedProduct.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-800 mb-2 m-0">Mô tả sản phẩm</h4>
                <p className="text-sm text-gray-600 leading-relaxed m-0 whitespace-pre-line">
                  {selectedProduct.productDescription || 'Chưa cập nhật mô tả.'}
                </p>
              </div>

              {/* Variants */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-800 mb-3 m-0">Biến thể ({selectedProduct.variants?.length || 0})</h4>
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
                          <th className="px-4 py-2">Mã SKU</th>
                          <th className="px-4 py-2">Thuộc tính</th>
                          <th className="px-4 py-2 text-right">Giá vốn</th>
                          <th className="px-4 py-2 text-right">Giá bán</th>
                          <th className="px-4 py-2 text-center">Tồn kho</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                          selectedProduct.variants.map((v) => (
                            <tr key={v.variantId} className="hover:bg-gray-200/50">
                              <td className="px-4 py-2 font-mono">{v.skuCode}</td>
                              <td className="px-4 py-2">
                                <div className="flex gap-1.5 flex-wrap">
                                  {Object.entries(v.variantAttributes || {}).map(([key, val]) => (
                                    <span key={key} className="bg-white border border-gray-300 px-1.5 py-0.5 rounded text-[10px]">
                                      {key}: {val}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-2 text-right text-gray-400">{formatCurrency(v.costPrice)}</td>
                              <td className="px-4 py-2 text-right font-bold text-emerald-600">{formatCurrency(v.price)}</td>
                              <td className="px-4 py-2 text-center font-bold">{v.stockQuantity}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-gray-400 italic">Không có biến thể nào</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-800 mb-3 m-0">Bộ sưu tập ảnh ({selectedProduct.images?.length || 0})</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    selectedProduct.images.map((img) => (
                      <div key={img.imageId} className="relative group">
                        <img 
                          src={img.imageUrl} 
                          alt="product gallery" 
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        {img.isThumbnail && (
                          <span className="absolute top-1 left-1 bg-[#00927c] text-white text-[9px] px-1 rounded font-bold">
                            Ảnh bìa
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">Không có hình ảnh trưng bày.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        
        <DialogActions className="p-6 pt-4 border-t border-gray-100">
          <Button 
            onClick={() => setIsDetailOpen(false)} 
            variant="contained"
            sx={{
              bgcolor: '#374151', textTransform: 'none', px: 4,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px', boxShadow: 'none',
              '&:hover': { bgcolor: '#1f2937', boxShadow: 'none' }
            }}
          >
            Đóng lại
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        title="Xác nhận ngừng kinh doanh"
        content="Bạn có chắc chắn muốn khóa/xóa sản phẩm này không? Hành động này sẽ chuyển trạng thái sản phẩm sang ngừng bán công khai."
        onConfirm={handleExecuteDelete}
        confirmText="Xóa ngay"
        cancelText="Hủy"
      />
    </div>
  );
};

export default AdminProductList;
