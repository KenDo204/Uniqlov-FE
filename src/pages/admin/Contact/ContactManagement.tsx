import React, { useState, useEffect } from 'react';
import {
  IconButton, CircularProgress, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Visibility, Close, Edit } from '@mui/icons-material';
import { useContact } from '@/hooks/useContact';
import { toast } from 'react-toastify';
import CustomPagination from '@/components/general/Pagination';
import ContactStatusChip from '@/components/admin/Contact/ContactStatusChip';
import type { ContactMessageResponse } from '@/types/contact';
import { PermissionGuard } from '@/components/shared/PermissionGuard';

const ContactManagement: React.FC = () => {
  const {
    adminContacts,
    isFetching,
    isSubmitting,
    loadAdminContacts,
    changeContactStatus
  } = useContact();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  const [selectedContact, setSelectedContact] = useState<ContactMessageResponse | null>(null);
  
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [contactToUpdate, setContactToUpdate] = useState<ContactMessageResponse | null>(null);
  const [newStatus, setNewStatus] = useState<'RESOLVED' | 'REJECTED'>('RESOLVED');

  useEffect(() => {
    loadAdminContacts({ 
      page: currentPage - 1, 
      size: itemsPerPage, 
      status: filterStatus || undefined 
    }).catch((err) => {
      console.error('Lỗi fetch contact:', err);
      toast.error('Không thể tải danh sách liên hệ');
    });
  }, [loadAdminContacts, currentPage, filterStatus]);

  const handleOpenStatusModal = (contact: ContactMessageResponse) => {
    setContactToUpdate(contact);
    setNewStatus(contact.status === 'PENDING' ? 'RESOLVED' : (contact.status as 'RESOLVED' | 'REJECTED'));
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!contactToUpdate) return;
    try {
      await changeContactStatus(contactToUpdate.messageId, { status: newStatus });
      toast.success('Đã cập nhật trạng thái liên hệ');
      setStatusModalOpen(false);
      setContactToUpdate(null);
    } catch (error: any) {
      toast.error(error || 'Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <div className="w-full text-left flex flex-col gap-6">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý Liên hệ - Góp ý - Khiếu nại</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">
              Xem và xử lý các phản hồi từ khách hàng
            </p>
          </div>
          
          <div className="w-48 bg-white rounded-lg shadow-sm">
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Trạng thái</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filterStatus}
                label="Trạng thái"
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                sx={{ backgroundColor: 'white', borderRadius: '8px' }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                <MenuItem value="RESOLVED">Đã xử lý</MenuItem>
                <MenuItem value="REJECTED">Từ chối</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 text-center">STT</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Người gửi</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider max-w-[250px]">Chủ đề</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ngày gửi</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isFetching && (!adminContacts || adminContacts.content.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <CircularProgress size={40} sx={{ color: 'var(--color-theme)' }} />
                    </td>
                  </tr>
                ) : !adminContacts || adminContacts.content.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                      Không tìm thấy liên hệ nào.
                    </td>
                  </tr>
                ) : (
                  adminContacts.content.map((contact, index) => (
                    <tr key={contact.messageId} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4 font-medium text-gray-500 text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{contact.guestName || 'Khách vãng lai'}</span>
                          <span className="text-sm text-gray-500">{contact.guestEmail || 'Không có email'}</span>
                          {contact.userId && (
                            <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 w-fit">
                              Thành viên
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-800 max-w-[250px] truncate" title={contact.subject}>
                        {contact.subject}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <ContactStatusChip status={contact.status} />
                      </td>

                      <td className="px-6 py-4 text-gray-500 text-sm text-right">
                        {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Tooltip title="Xem chi tiết" arrow>
                            <IconButton 
                              size="small" 
                              onClick={() => setSelectedContact(contact)}
                              className="text-gray-600 hover:bg-gray-100"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <PermissionGuard permission="contact:update">
                            <Tooltip title="Đổi trạng thái" arrow>
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenStatusModal(contact)}
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </PermissionGuard>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isFetching && adminContacts && adminContacts.totalElements > itemsPerPage && (
            <div className="p-4 border-t border-gray-100">
              <CustomPagination
                currentPage={currentPage}
                totalPages={adminContacts.totalPages}
                totalItems={adminContacts.totalElements}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>

      {/* View Detail Dialog */}
      <Dialog 
        open={!!selectedContact} 
        onClose={() => setSelectedContact(null)}
        fullWidth
        maxWidth="md"
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}
      >
        {selectedContact && (
          <>
            <DialogTitle className="flex justify-between items-center border-b border-gray-100">
              <span className="font-bold text-gray-800 text-lg">Chi tiết phản hồi #{selectedContact.messageId}</span>
              <IconButton onClick={() => setSelectedContact(null)} size="small">
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Người gửi</Typography>
                    <Typography variant="body1" className="font-medium mt-1">
                      {selectedContact.guestName || 'Không có tên'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Email</Typography>
                    <Typography variant="body1" className="font-medium mt-1">
                      {selectedContact.guestEmail || 'Không có email'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Trạng thái hiện tại</Typography>
                    <div className="mt-1">
                      <ContactStatusChip status={selectedContact.status} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Ngày gửi</Typography>
                    <Typography variant="body1" className="font-medium mt-1">
                      {new Date(selectedContact.createdAt).toLocaleString('vi-VN')}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Loại tài khoản</Typography>
                    <Typography variant="body1" className="font-medium mt-1">
                      {selectedContact.userId ? 'Thành viên đã đăng ký' : 'Khách vãng lai'}
                    </Typography>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Chủ đề</Typography>
                <Typography variant="h6" className="font-bold mt-1 text-gray-800">{selectedContact.subject}</Typography>
              </div>
              
              <div className="mt-4">
                <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Nội dung chi tiết</Typography>
                <div className="mt-2 p-5 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 whitespace-pre-wrap text-base leading-relaxed min-h-[150px]">
                  {selectedContact.content}
                </div>
              </div>
            </DialogContent>
            <DialogActions className="border-t border-gray-100 px-6 py-4 flex justify-between">
              <Button 
                onClick={() => {
                  setSelectedContact(null);
                  handleOpenStatusModal(selectedContact);
                }} 
                variant="outlined" 
                startIcon={<Edit />}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
              >
                Cập nhật trạng thái
              </Button>
              <Button 
                onClick={() => setSelectedContact(null)} 
                variant="contained" 
                sx={{ backgroundColor: 'gray', textTransform: 'none', fontWeight: 600, borderRadius: '8px', boxShadow: 'none', '&:hover': { backgroundColor: '#555' } }}
              >
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Update Status Modal */}
      <Dialog 
        open={statusModalOpen} 
        onClose={() => !isSubmitting && setStatusModalOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}
      >
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100">
          Cập nhật trạng thái
        </DialogTitle>
        <DialogContent className="py-6">
          <Typography className="text-gray-600 mb-4 text-sm">
            Thay đổi trạng thái cho phản hồi: <strong className="text-gray-800">{contactToUpdate?.subject}</strong>
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel id="update-status-label">Trạng thái mới</InputLabel>
            <Select
              labelId="update-status-label"
              value={newStatus}
              label="Trạng thái mới"
              onChange={(e) => setNewStatus(e.target.value as 'RESOLVED' | 'REJECTED')}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="RESOLVED">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Đã xử lý (Giải quyết xong)
                </div>
              </MenuItem>
              <MenuItem value="REJECTED">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Từ chối (Spam/Không hợp lệ)
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setStatusModalOpen(false)} 
            disabled={isSubmitting}
            sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ backgroundColor: 'var(--color-theme)', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: '8px', boxShadow: 'none', '&:hover': { backgroundColor: 'var(--color-theme-hover)' } }}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactManagement;
