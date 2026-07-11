import React, { useEffect, useState } from 'react';
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { Close, Visibility } from '@mui/icons-material';
import { useContact } from '@/hooks/useContact';
import ContactStatusChip from '@/components/admin/Contact/ContactStatusChip';
import CustomPagination from '@/components/general/Pagination';
import type { ContactMessageResponse } from '@/types/contact';

const MyContactHistory: React.FC = () => {
  const { myContacts, loadMyContacts, isFetching } = useContact();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedContact, setSelectedContact] = useState<ContactMessageResponse | null>(null);

  useEffect(() => {
    loadMyContacts({ page: currentPage - 1, size: itemsPerPage });
  }, [loadMyContacts, currentPage]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-left">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Lịch sử Góp ý / Liên hệ</h2>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 text-center">STT</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Chủ đề</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ngày gửi</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && (!myContacts || myContacts.content.length === 0) ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <CircularProgress size={30} sx={{ color: 'var(--color-theme)' }} />
                </td>
              </tr>
            ) : !myContacts || myContacts.content.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Bạn chưa gửi liên hệ / góp ý nào.
                </td>
              </tr>
            ) : (
              myContacts.content.map((contact, index) => (
                <tr key={contact.messageId} className="hover:bg-gray-50/50 border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-500 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate" title={contact.subject}>
                    {contact.subject}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ContactStatusChip status={contact.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm text-right">
                    {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <IconButton size="small" onClick={() => setSelectedContact(contact)} className="text-theme">
                      <Visibility fontSize="small" />
                    </IconButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isFetching && myContacts && myContacts.totalElements > itemsPerPage && (
        <div className="pt-4 border-t border-gray-100 mt-4">
          <CustomPagination
            currentPage={currentPage}
            totalPages={myContacts.totalPages}
            totalItems={myContacts.totalElements}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog 
        open={!!selectedContact} 
        onClose={() => setSelectedContact(null)}
        fullWidth
        maxWidth="sm"
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}
      >
        {selectedContact && (
          <>
            <DialogTitle className="flex justify-between items-center border-b border-gray-100">
              <span className="font-bold text-gray-800">Chi tiết Liên hệ</span>
              <IconButton onClick={() => setSelectedContact(null)} size="small">
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent className="py-6">
              <div className="space-y-4">
                <div>
                  <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Chủ đề</Typography>
                  <Typography variant="body1" className="font-medium mt-1">{selectedContact.subject}</Typography>
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Trạng thái</Typography>
                  <div className="mt-1">
                    <ContactStatusChip status={selectedContact.status} />
                  </div>
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Ngày gửi</Typography>
                  <Typography variant="body2" className="mt-1 text-gray-700">
                    {new Date(selectedContact.createdAt).toLocaleString('vi-VN')}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-500 uppercase font-bold tracking-wider">Nội dung</Typography>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedContact.content}
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions className="border-t border-gray-100 px-6 py-3">
              <Button onClick={() => setSelectedContact(null)} variant="outlined" sx={{ color: 'gray', borderColor: 'lightgray', textTransform: 'none' }}>
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default MyContactHistory;
