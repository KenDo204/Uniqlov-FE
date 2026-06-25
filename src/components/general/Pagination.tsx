import React from 'react';
import { Box, Typography, Pagination as MuiPagination, PaginationItem } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface CustomPaginationProps {
  currentPage: number; // 1-indexed
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange
}: CustomPaginationProps) {
  // Hide pagination if there is <= 1 page or total items is <= itemsPerPage
  if (totalPages <= 1 || totalItems <= itemsPerPage) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
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
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
        Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trong <strong>{totalItems}</strong> bản ghi
      </Typography>

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
                bgcolor: '#00927c',
                color: 'white',
                '&:hover': {
                  bgcolor: '#007a68',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(0, 146, 124, 0.08)',
              }
            }}
          />
        )}
      />
    </Box>
  );
}
