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
  const mainRevenue = apiRevenue ?? orderStatsRevenue ?? 0;
  const secondaryRevenue = orderStatsRevenue ?? 0;

  return (
    <Paper
      elevation={0}
      className="p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-md flex flex-col justify-between h-full min-h-[220px] sm:min-h-[280px]"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
      }}
    >
      <Box>
        <Box className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mb-3 sm:mb-4">
          <Box
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-white flex items-center justify-center shrink-0 shadow-md"
            style={{ backgroundColor: 'var(--color-theme)' }}
          >
            <AccountBalanceWalletIcon className="text-xl sm:text-2xl" />
          </Box>
          <Chip
            icon={<TrendingUpIcon style={{ fontSize: '16px', color: 'var(--color-theme)' }} />}
            label="Doanh thu thực tế"
            className="font-bold text-[11px] sm:text-xs rounded-lg border-0"
            style={{
              backgroundColor: 'var(--color-theme-light)',
              color: 'var(--color-theme)',
            }}
          />
        </Box>

        <Typography className="text-xs sm:text-sm text-gray-600 font-semibold mb-1.5 tracking-wider uppercase">
          Tổng doanh thu hệ thống
        </Typography>

        <Typography
          className="!font-extrabold tracking-tight break-all sm:break-normal !leading-none"
          style={{
            color: 'var(--color-theme)',
            fontSize: 'clamp(1.5rem, 2vw + 0.5rem, 2.25rem)',
            lineHeight: 1.1,
          }}
        >
          {formatVND(mainRevenue)}
        </Typography>
      </Box>

      <Box className="mt-4">
        <Divider className="my-3 border-gray-200" />

        <Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
          <Box className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm">
            <ShoppingBagIcon fontSize="small" className="text-gray-400" />
            <span>Doanh thu từ Đơn hàng:</span>
          </Box>
          <Typography className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
            {formatVND(secondaryRevenue)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
