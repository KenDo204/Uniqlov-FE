import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button, Typography, Paper, Box } from '@mui/material';
import { CheckCircle, Cancel, ContentCopy, Info } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { paths } from '@/config/paths';
import { BRAND } from '@/constants/brand';

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Đọc linh hoạt các tham số trả về từ Backend / VNPay
  const successParam = searchParams.get('success');
  const statusParam = searchParams.get('status');
  const vnpResponseCode = searchParams.get('vnp_ResponseCode');
  const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus');

  const trackingNumber =
    searchParams.get('trackingNumber') ||
    searchParams.get('orderId') ||
    searchParams.get('vnp_TxnRef') ||
    searchParams.get('orderNo') ||
    '';

  // Kiểm tra xem có bất kỳ tham số kết quả thanh toán nào được truyền sang hay không
  const hasQueryParams =
    successParam !== null ||
    statusParam !== null ||
    vnpResponseCode !== null ||
    vnpTransactionStatus !== null ||
    trackingNumber !== '';

  // Xác định trạng thái thành công
  const isSuccess =
    successParam === 'true' ||
    statusParam?.toUpperCase() === 'SUCCESS' ||
    statusParam?.toUpperCase() === 'PAID' ||
    vnpResponseCode === '00' ||
    vnpTransactionStatus === '00';

  const handleCopyTracking = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      toast.success('Đã sao chép mã đơn hàng');
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-4 font-sans">
      <Paper elevation={3} className="p-8 md:p-12 max-w-md w-full text-center rounded-2xl">
        {hasQueryParams ? (
          <>
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
                : 'Rất tiếc, quá trình thanh toán của bạn không thành công hoặc đã bị hủy. Vui lòng kiểm tra lại đơn hàng hoặc thử lại.'}
            </Typography>

            {trackingNumber && (
              <Box className="bg-gray-100 p-4 rounded-lg mb-8 flex items-center justify-between">
                <Box className="text-left">
                  <Typography variant="caption" className="text-gray-500 font-medium block">
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
                  title="Sao chép mã đơn hàng"
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
                    fullWidth
                    size="large"
                    component={Link}
                    to={`${paths.customer.account}/orders`}
                    sx={{
                      bgcolor: 'var(--color-theme)',
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: 'var(--color-theme-hover)' }
                    }}
                  >
                    Xem đơn hàng của tôi
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    component={Link}
                    to={paths.customer.products}
                    sx={{
                      borderColor: '#d1d5db',
                      color: '#374151',
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                    }}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    component={Link}
                    to={paths.customer.checkout}
                    sx={{
                      bgcolor: 'var(--color-theme)',
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: 'var(--color-theme-hover)' }
                    }}
                  >
                    Quay lại trang thanh toán
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    component={Link}
                    to={paths.customer.home}
                    sx={{
                      borderColor: '#d1d5db',
                      color: '#374151',
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                    }}
                  >
                    Về trang chủ
                  </Button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <Info className="text-blue-500 w-24 h-24 mx-auto mb-6" />
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Kết quả thanh toán
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              Không tìm thấy thông tin tham số giao dịch. Vui lòng kiểm tra lại trong lịch sử đơn hàng.
            </Typography>
            <Box className="flex flex-col gap-3">
              <Button
                variant="contained"
                fullWidth
                size="large"
                component={Link}
                to={`${paths.customer.account}/orders`}
                sx={{
                  bgcolor: 'var(--color-theme)',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: 'var(--color-theme-hover)' }
                }}
              >
                Xem đơn hàng của tôi
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                component={Link}
                to={paths.customer.home}
                sx={{
                  borderColor: '#d1d5db',
                  color: '#374151',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                }}
              >
                Về trang chủ
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentResult;

