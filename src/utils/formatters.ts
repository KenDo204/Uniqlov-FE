export const formatVND = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return `${value}%`;
};

export const translateAttribute = (key: string): string => {
  const lowerKey = key.toLowerCase();
  if (lowerKey === 'size') return 'Kích thước';
  if (lowerKey === 'color') return 'Màu sắc';
  return key;
};
