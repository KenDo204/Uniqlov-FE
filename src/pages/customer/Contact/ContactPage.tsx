import React, { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useContact } from '@/hooks/useContact';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { sendContact, isSubmitting } = useContact();
  const navigate = useNavigate();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated && (!guestName.trim() || !guestEmail.trim())) {
      toast.error('Vui lòng nhập tên và email của bạn');
      return;
    }

    if (!subject.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    if (subject.length > 200) {
      toast.error('Tiêu đề không được vượt quá 200 ký tự');
      return;
    }

    if (!content.trim() || content.trim().length < 10) {
      toast.error('Nội dung phải có ít nhất 10 ký tự');
      return;
    }

    try {
      await sendContact({
        guestName: !isAuthenticated ? guestName.trim() : undefined,
        guestEmail: !isAuthenticated ? guestEmail.trim() : undefined,
        subject: subject.trim(),
        content: content.trim()
      });

      toast.success('Đã gửi phản hồi thành công. Cảm ơn bạn!');
      
      // Reset form
      setGuestName('');
      setGuestEmail('');
      setSubject('');
      setContent('');

      if (isAuthenticated) {
        navigate('/account/contacts');
      }

    } catch (error: any) {
      toast.error(error || 'Lỗi khi gửi liên hệ');
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[800px] mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Liên hệ - Góp ý</h1>
        <p className="text-gray-500 mb-8">
          Chúng tôi luôn lắng nghe và đánh giá cao mọi ý kiến đóng góp của bạn. Vui lòng điền thông tin bên dưới để gửi phản hồi cho chúng tôi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                label="Họ và tên của bạn"
                variant="outlined"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Địa chỉ email"
                type="email"
                variant="outlined"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
              />
            </div>
          )}

          <TextField
            fullWidth
            label="Chủ đề góp ý / khiếu nại"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            helperText={`${subject.length}/200 ký tự`}
            error={subject.length > 200}
          />

          <TextField
            fullWidth
            label="Nội dung chi tiết"
            variant="outlined"
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            helperText="Nhập ít nhất 10 ký tự"
          />

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
              sx={{
                backgroundColor: 'var(--color-theme)',
                textTransform: 'none',
                fontWeight: 'bold',
                px: 5,
                py: 1.5,
                borderRadius: '8px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-theme-hover)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi liên hệ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
