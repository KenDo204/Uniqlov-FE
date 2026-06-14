import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';

export const formatDate = (date: Date | string, pattern = 'dd/MM/yyyy HH:mm'): string => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, pattern);
  } catch (error) {
    console.error('Error formatting date with date-fns:', error);
    return '';
  }
};

export const formatWithDayjs = (date: dayjs.ConfigType, formatStr = 'DD/MM/YYYY HH:mm'): string => {
  return dayjs(date).format(formatStr);
};
