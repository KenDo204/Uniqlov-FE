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

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

