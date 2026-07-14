import React, { type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface SliderFormCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const SliderFormCard: React.FC<SliderFormCardProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <Box 
      className={`bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden ${className}`}
      sx={{ transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)' } }}
    >
      <div className="p-5 sm:p-6 border-b border-gray-100/80 bg-gray-50/30">
        <Typography variant="h6" className="text-gray-800 font-semibold text-[17px]">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" className="text-gray-500 mt-1.5 text-[13px]">
            {subtitle}
          </Typography>
        )}
      </div>
      <div className="p-5 sm:p-6">
        {children}
      </div>
    </Box>
  );
};
