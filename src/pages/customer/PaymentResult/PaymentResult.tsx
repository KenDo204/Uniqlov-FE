import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button, Typography, Paper, Box } from '@mui/material';
import { CheckCircle, Cancel, ContentCopy } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { paths } from '@/config/paths';
import { BRAND } from '@/constants/brand';

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const successParam = searchParams.get('success');
  const trackingNumber = searchParams.get('trackingNumber') || '';

  const isSuccess = successParam === 'true';

  useEffect(() => {
    // If no success param is present, maybe user accessed this page directly, redirect to home
    if (successParam === null) {
      navigate(paths.customer.home);
    }
  }, [successParam, navigate]);

  const handleCopyTracking = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      toast.success('Đã sao chép mã đơn hàng');
    }
  };

  if (successParam === null) {
    return null;
  }

  return (
    <Box className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-4">
      <Paper elevation={3} className="p-8 md:p-12 max-w-md w-full text-center rounded-2xl">
        {isSuccess ? (
          <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" />
        ) : (
          <Cancel className="text-red-500 w-24 h-24 mx-auto mb-6" />
        )}

        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </Typography>

        <Typography variant="body1" className="text-gray-600 mb-6">
          {isSuccess
            ? `Cảm ơn bạn đã mua sắm tại ${BRAND.NAME}. Đơn hàng của bạn đã được thanh toán thành công và đang được xử lý.`
            : 'Rất tiếc, quá trình thanh toán của bạn không thành công hoặc đã bị hủy. Vui lòng thử lại.'}
        </Typography>

        {trackingNumber && (
          <Box className="bg-gray-100 p-4 rounded-lg mb-8 flex items-center justify-between">
            <Box className="text-left">
              <Typography variant="caption" className="text-gray-500 font-medium">
                MÃ ĐƠN HÀNG
              </Typography>
              <Typography variant="subtitle1" className="font-bold text-gray-800">
                {trackingNumber}
              </Typography>
            </Box>
            <Button
              onClick={handleCopyTracking}
              variant="text"
              color="inherit"
              size="small"
              className="min-w-0 p-2"
            >
              <ContentCopy fontSize="small" className="text-gray-500" />
            </Button>
          </Box>
        )}

        <Box className="flex flex-col gap-3">
          {isSuccess ? (
            <>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                component={Link}
                to={`${paths.customer.account}/orders`}
                className="bg-theme hover:bg-theme-dark rounded-xl py-3"
              >
                Xem đơn hàng
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                component={Link}
                to={paths.customer.products}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3"
              >
                Tiếp tục mua sắm
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                component={Link}
                to={paths.customer.checkout}
                className="bg-theme hover:bg-theme-dark rounded-xl py-3"
              >
                Quay lại trang thanh toán
              </Button>
              <Button
                variant="text"
                fullWidth
                size="large"
                component={Link}
                to={paths.customer.home}
                className="text-gray-600 rounded-xl py-3"
              >
                Về trang chủ
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentResult;
