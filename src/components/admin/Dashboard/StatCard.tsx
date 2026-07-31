import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  iconBgColor = 'rgba(0, 146, 124, 0.1)',
  iconColor = 'var(--color-theme)',
}) => {
  return (
    <Paper
      elevation={0}
      className="p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#00927c]/30 flex flex-col justify-between h-full cursor-default"
    >
      <Box className="flex items-center justify-between mb-3 sm:mb-4">
        <Box
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          {icon}
        </Box>
        {subtitle && (
          <span className="text-[11px] sm:text-xs text-gray-400 font-medium truncate max-w-[110px] sm:max-w-none">
            {subtitle}
          </span>
        )}
      </Box>

      <div>
        <Typography className="text-xs sm:text-sm text-gray-500 font-semibold mb-1 truncate" title={title}>
          {title}
        </Typography>

        <Typography className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 truncate">
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </Typography>
      </div>
    </Paper>
  );
};
