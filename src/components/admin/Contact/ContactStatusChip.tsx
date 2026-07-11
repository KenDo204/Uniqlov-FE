import React from 'react';

interface ContactStatusChipProps {
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
}

const ContactStatusChip: React.FC<ContactStatusChipProps> = ({ status }) => {
  switch (status) {
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          Đã xử lý
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          Từ chối
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          Chờ xử lý
        </span>
      );
  }
};

export default ContactStatusChip;
