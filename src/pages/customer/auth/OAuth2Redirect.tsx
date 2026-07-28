import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

export function OAuth2Redirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { exchangeOAuth2Code, fetchProfile, resetAuth } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam || !code) {
      toast.error('Đăng nhập bằng Google thất bại hoặc bị hủy.');
      navigate('/login', { replace: true });
      return;
    }

    const processExchange = async () => {
      resetAuth();
      try {
        await exchangeOAuth2Code({ code });
        toast.success('Đăng nhập bằng Google thành công!');
        await fetchProfile();
        navigate('/', { replace: true });
      } catch (err: any) {
        toast.error(err || 'Mã xác thực Google không hợp lệ hoặc đã hết hạn. Vui lòng thử lại!');
        navigate('/login', { replace: true });
      }
    };

    processExchange();
  }, [searchParams, exchangeOAuth2Code, fetchProfile, resetAuth, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-white text-gray-800">
      <CircularProgress size={48} sx={{ color: 'var(--color-theme,#008060)' }} />
      <h2 className="text-xl font-bold text-gray-800">Đang xác thực đăng nhập Google...</h2>
      <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
export default OAuth2Redirect;
