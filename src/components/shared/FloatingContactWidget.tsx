import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactMessageSchema, type ContactMessageFormValues as ContactFormData } from '@/schemas';
import { X, MessageSquare, Send } from '@/components/ui/icons';
import { useContact } from '@/hooks/useContact';
import { useAppSelector } from '@/stores/hooks';
import { toast } from 'react-toastify';
import type { ContactMessageRequest } from '@/types/contact';
import { cn } from '@/lib/utils';
import { CONTACT_SUBJECTS } from '@/constants/contact-subjects';

export function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { sendContact, isSubmitting } = useContact();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      guestName: '',
      guestEmail: '',
      subject: '',
      content: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const payload: ContactMessageRequest = {
        subject: data.subject.trim(),
        content: data.content.trim(),
      };

      if (!isAuthenticated) {
        payload.guestName = data.guestName?.trim();
        payload.guestEmail = data.guestEmail?.trim();
      }

      await sendContact(payload);
      toast.success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      reset();
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Expanded window */}
      {isOpen && (
        <div className="w-[320px] md:w-[380px] bg-white border border-gray-200 shadow-2xl rounded-2xl flex flex-col mb-4 overflow-hidden animate-slide-up text-left">
          {/* Header */}
          <div className="p-4 bg-[var(--color-theme,#1a1a1a)] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-white" />
              <div>
                <div className="font-heading font-bold text-sm tracking-wide">
                  Liên hệ - Góp ý
                </div>
                <div className="text-[11px] text-gray-200 opacity-90">
                  Chúng tôi luôn lắng nghe bạn
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full border-none bg-transparent cursor-pointer text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-5 bg-[#fafafa]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isAuthenticated && (
                <>
                  <div className="space-y-1">
                    <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('guestName')}
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className={cn(
                        "w-full px-3 py-2.5 bg-white border rounded-[4px] text-[13px] outline-none transition-all",
                        errors.guestName ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[var(--color-theme,#1a1a1a)] focus:ring-1 focus:ring-[var(--color-theme,#1a1a1a)]"
                      )}
                    />
                    {errors.guestName && (
                      <p className="text-red-500 text-[11px] mt-1 m-0">{errors.guestName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('guestEmail')}
                      type="email"
                      placeholder="email@example.com"
                      className={cn(
                        "w-full px-3 py-2.5 bg-white border rounded-[4px] text-[13px] outline-none transition-all",
                        errors.guestEmail ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[var(--color-theme,#1a1a1a)] focus:ring-1 focus:ring-[var(--color-theme,#1a1a1a)]"
                      )}
                    />
                    {errors.guestEmail && (
                      <p className="text-red-500 text-[11px] mt-1 m-0">{errors.guestEmail.message}</p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                  Chủ đề <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register('subject')}
                    className={cn(
                      "w-full px-3 py-2.5 bg-white border rounded-[4px] text-[13px] outline-none transition-all appearance-none cursor-pointer",
                      errors.subject ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[var(--color-theme,#1a1a1a)] focus:ring-1 focus:ring-[var(--color-theme,#1a1a1a)]"
                    )}
                  >
                    <option value="">Chọn chủ đề liên hệ</option>
                    {CONTACT_SUBJECTS.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                  {/* Custom arrow for select */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.subject && (
                  <p className="text-red-500 text-[11px] mt-1 m-0">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('content')}
                  rows={4}
                  placeholder="Chi tiết tin nhắn..."
                  className={cn(
                    "w-full px-3 py-2.5 bg-white border rounded-[4px] text-[13px] outline-none transition-all resize-none",
                    errors.content ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[var(--color-theme,#1a1a1a)] focus:ring-1 focus:ring-[var(--color-theme,#1a1a1a)]"
                  )}
                />
                {errors.content && (
                  <p className="text-red-500 text-[11px] mt-1 m-0">{errors.content.message}</p>
                )}
              </div>


              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-[var(--color-theme,#1a1a1a)] hover:bg-[var(--color-theme-hover,#000000)] text-white font-bold rounded-[4px] text-[13px] uppercase tracking-widest active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    Gửi <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating button trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[var(--color-theme,#1a1a1a)] hover:bg-[var(--color-theme-hover,#000000)] text-white p-4 rounded-full shadow-xl flex items-center gap-2 border-none cursor-pointer hover:scale-105 hover:-translate-y-1 transition-all duration-300 font-bold group"
          title="Liên hệ - Góp ý"
        >
          <MessageSquare className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          <span className="text-[13px] font-heading font-bold tracking-wide pr-1 hidden sm:inline text-white whitespace-nowrap">
            Liên hệ
          </span>
        </button>
      )}
    </div>
  );
}
