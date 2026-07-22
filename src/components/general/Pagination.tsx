import React from 'react';
import { Box, Typography, Pagination as MuiPagination, PaginationItem } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface CustomPaginationProps {
  currentPage: number; // 1-indexed
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function CustomPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [10, 20, 50, 100]
}: CustomPaginationProps) {
  // Hide pagination if totalItems is 0
  if (totalItems === 0) {
    return null;
  }

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 3,
        py: 2,
        bgcolor: 'grey.50',
        borderTop: '1px solid',
        borderColor: 'grey.100',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
          Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trong <strong>{totalItems}</strong> bản ghi
        </Typography>

        {onItemsPerPageChange && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Cỡ trang:
            </Typography>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-200 rounded text-xs bg-white text-gray-700 font-medium outline-none cursor-pointer focus:border-theme"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} / trang
                </option>
              ))}
            </select>
          </Box>
        )}
      </Box>

      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        siblingCount={1}
        boundaryCount={1}
        shape="rounded"
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBack, next: ArrowForward }}
            {...item}
            sx={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              borderRadius: '8px',
              '&.Mui-selected': {
                bgcolor: 'var(--color-theme)',
                color: 'white',
                '&:hover': {
                  bgcolor: '#007a68',
                },
              },
              '&:hover': {
                bgcolor: 'var(--color-theme-light)',
              }
            }}
          />
        )}
      />
    </Box>
  );
}
