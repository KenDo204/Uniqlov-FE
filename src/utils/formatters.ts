export const formatVND = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return `${value}%`;
};
