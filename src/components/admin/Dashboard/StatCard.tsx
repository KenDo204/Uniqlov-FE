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
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #f3f4f6',
        bgcolor: '#ffffff',
        transition: 'all 0.3s ease',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(0, 146, 124, 0.15)',
          borderColor: 'rgba(0, 146, 124, 0.3)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: iconBgColor,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>

      <Typography variant="h4" sx={{ color: '#111827', fontWeight: 800 }}>
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
      </Typography>
    </Paper>
  );
};
