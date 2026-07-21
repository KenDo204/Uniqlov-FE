import React from 'react';
import { Paper, Box, Typography, Divider, Chip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { formatVND } from '@/utils/formatters';

interface RevenueCardProps {
  apiRevenue?: number | null;
  orderStatsRevenue?: number | null;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  apiRevenue,
  orderStatsRevenue,
}) => {
  // Use apiRevenue if available, fallback to orderStatsRevenue
  const mainRevenue = apiRevenue ?? orderStatsRevenue ?? 0;
  const secondaryRevenue = orderStatsRevenue ?? 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #f3f4f6',
        bgcolor: '#ffffff',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 10px 20px -5px rgba(0, 146, 124, 0.1)',
        },
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              bgcolor: 'var(--color-theme)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px -4px rgba(0, 146, 124, 0.4)',
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
          </Box>
          <Chip
            icon={<TrendingUpIcon sx={{ fontSize: '16px !important', color: 'var(--color-theme) !important' }} />}
            label="Doanh thu thực tế"
            sx={{
              bgcolor: 'var(--color-theme-light)',
              color: 'var(--color-theme)',
              fontWeight: 700,
              fontSize: '12px',
              borderRadius: '8px',
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 600, mb: 1 }}>
          TỔNG DOANH THU HỆ THỐNG
        </Typography>

        <Typography variant="h3" sx={{ color: 'var(--color-theme)', fontWeight: 800, mb: 2 }}>
          {formatVND(mainRevenue)}
        </Typography>
      </Box>

      <Box>
        <Divider sx={{ my: 2, borderColor: '#e5e7eb' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBagIcon sx={{ fontSize: 18, color: '#6b7280' }} />
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '13px' }}>
              Doanh thu từ Đơn hàng:
            </Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>
            {formatVND(secondaryRevenue)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
