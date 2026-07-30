import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { CheckCircle, Cancel, ContentCopy, Info } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { paths } from '@/config/paths';
import { BRAND } from '@/constants/brand';
import { useTracking } from '@/hooks/useTracking';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/orderService';
import { Source } from '@/types/tracking/requests';

export const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { trackPurchase } = useTracking();
  const { fetchCart } = useCart();

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

  const isParamSuccess =
    successParam === 'true' ||
    statusParam?.toUpperCase() === 'SUCCESS' ||
    statusParam?.toUpperCase() === 'PAID' ||
    vnpResponseCode === '00' ||
    vnpTransactionStatus === '00';

  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState<boolean>(false);
  const [orderStatusText, setOrderStatusText] = useState<string>('');

  const hasProcessedRef = useRef<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const verifyPaymentStatus = async () => {
      if (!trackingNumber) {
        if (isMounted) {
          setIsVerifying(false);
          setIsVerifiedSuccess(false);
        }
        return;
      }

      if (!isParamSuccess) {
        if (isMounted) {
          setIsVerifying(false);
          setIsVerifiedSuccess(false);
        }
        return;
      }

      // Security Check: Verify order status with Backend API
      const orderIdNum = Number(trackingNumber);
      if (!isNaN(orderIdNum) && orderIdNum > 0) {
        try {
          const orderRes = await orderService.getMyOrderDetail(orderIdNum);
          if (isMounted && orderRes && orderRes.result) {
            const currentStatus = orderRes.result.orderStatus;
            setOrderStatusText(currentStatus);

            // Verified success if order status is updated beyond PENDING_PAYMENT / CANCELLED
            if (currentStatus !== 'PENDING_PAYMENT' && currentStatus !== 'CANCELLED') {
              setIsVerifiedSuccess(true);

              if (!hasProcessedRef.current) {
                hasProcessedRef.current = true;
                // Dispatch action to clear cart after successful payment
                fetchCart().catch(() => {});
                // Track Purchase
                trackPurchase({ orderId: orderIdNum, source: Source.CHECKOUT_PAGE });
              }
            } else {
              // Status is still PENDING_PAYMENT or CANCELLED
              setIsVerifiedSuccess(false);
            }
          } else if (isMounted) {
            // Fallback to param success if order query returned no result
            setIsVerifiedSuccess(true);
            if (!hasProcessedRef.current) {
              hasProcessedRef.current = true;
              fetchCart().catch(() => {});
              trackPurchase({ orderId: orderIdNum, source: Source.CHECKOUT_PAGE });
            }
          }
        } catch (_err) {
          // In case API check fails (e.g. unauthenticated or network error), fallback to URL success param
          if (isMounted) {
            setIsVerifiedSuccess(isParamSuccess);
            if (isParamSuccess && !hasProcessedRef.current) {
              hasProcessedRef.current = true;
              fetchCart().catch(() => {});
              trackPurchase({ orderId: orderIdNum, source: Source.CHECKOUT_PAGE });
            }
          }
        }
      } else {
        if (isMounted) {
          setIsVerifiedSuccess(isParamSuccess);
          if (isParamSuccess && !hasProcessedRef.current) {
            hasProcessedRef.current = true;
            fetchCart().catch(() => {});
          }
        }
      }

      if (isMounted) {
        setIsVerifying(false);
      }
    };

    verifyPaymentStatus();

    return () => {
      isMounted = false;
    };
  }, [trackingNumber, isParamSuccess, fetchCart, trackPurchase]);

  const handleCopyTracking = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      toast.success('Đã sao chép mã đơn hàng');
    }
  };

  const hasQueryParams = successParam !== null || statusParam !== null || vnpResponseCode !== null || trackingNumber !== '';

  return (
    <Box className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-4 font-sans">
      <Paper elevation={3} className="p-8 md:p-12 max-w-md w-full text-center rounded-2xl">
        {isVerifying ? (
          <Box className="py-12 flex flex-col items-center justify-center gap-4">
            <CircularProgress size={48} sx={{ color: 'var(--color-theme, #00927c)' }} />
            <Typography variant="h6" className="font-semibold text-gray-700">
              Đang xác minh kết quả thanh toán...
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Vui lòng chờ trong giây lát.
            </Typography>
          </Box>
        ) : hasQueryParams ? (
          <>
            {isVerifiedSuccess ? (
              <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" />
            ) : (
              <Cancel className="text-red-500 w-24 h-24 mx-auto mb-6" />
            )}

            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              {isVerifiedSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
            </Typography>

            <Typography variant="body1" className="text-gray-600 mb-6">
              {isVerifiedSuccess
                ? `Cảm ơn bạn đã mua sắm tại ${BRAND.NAME}. Đơn hàng của bạn đã được thanh toán thành công qua VNPAY và đang được xử lý.`
                : 'Giao dịch bị hủy hoặc thanh toán không thành công. Vui lòng kiểm tra lại đơn hàng hoặc thử lại.'}
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
                  {orderStatusText && (
                    <Typography variant="caption" className="text-gray-500 block mt-0.5">
                      Trạng thái: <span className="font-semibold text-theme">{orderStatusText}</span>
                    </Typography>
                  )}
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
              {isVerifiedSuccess ? (
                <>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    component={Link}
                    to={`${paths.customer.account}/orders`}
                    sx={{
                      bgcolor: 'var(--color-theme, #00927c)',
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: 'var(--color-theme-hover, #007a68)' },
                    }}
                  >
                    Xem chi tiết đơn hàng
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
                      '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
                    }}
                  >
                    Về trang chủ
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
                      bgcolor: 'var(--color-theme, #00927c)',
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: 'var(--color-theme-hover, #007a68)' },
                    }}
                  >
                    Thử thanh toán lại
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
                      '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
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
                  bgcolor: 'var(--color-theme, #00927c)',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: 'var(--color-theme-hover, #007a68)' },
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
                  '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
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

export default PaymentStatusPage;
