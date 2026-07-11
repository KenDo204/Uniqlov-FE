import React from 'react';
import { Radio } from '@mui/material';
import type { AddressResponse } from '@/types/address';

interface AddressCardProps {
    address: AddressResponse;
    selectedValue?: number | null;
    onSelect?: (address: AddressResponse) => void;
    onEdit?: (address: AddressResponse) => void;
    onDelete?: (id: number) => void;
    onSetDefault?: (id: number) => void;
    showActions?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({ 
    address, 
    selectedValue, 
    onSelect, 
    onEdit, 
    onDelete, 
    onSetDefault,
    showActions = true
}) => {
    const isSelected = selectedValue === address.addressId;
    
    return (
        <div 
            className={`bg-white border p-5 sm:p-6 rounded-[8px] relative transition-all duration-200 flex gap-4 w-full text-left overflow-hidden
                ${isSelected 
                    ? 'border-theme shadow-sm ring-1 ring-[var(--color-theme)] ring-opacity-20 bg-[rgba(0,146,124,0.02)]' 
                    : 'border-gray-200 shadow-sm hover:border-gray-300'} 
                ${onSelect ? 'cursor-pointer hover:shadow-md' : ''}`}
            onClick={() => onSelect && onSelect(address)}
        >
            {onSelect && (
                <div className="pt-0.5 shrink-0">
                    <Radio
                        checked={isSelected}
                        onChange={() => onSelect(address)}
                        value={address.addressId}
                        name="address-radio"
                        sx={{
                            color: 'var(--color-theme)',
                            '&.Mui-checked': { color: 'var(--color-theme)' },
                            p: 0,
                            '&:hover': { bgcolor: 'transparent' }
                        }}
                    />
                </div>
            )}

            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-base">{address.recipientName}</span>
                        {address.isDefault && (
                            <span className="inline-flex items-center text-[10px] uppercase font-bold text-theme border border-theme px-1.5 py-0.5 rounded-sm bg-white">
                                Mặc định
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5 text-[14px]">
                    <div className="flex items-start gap-2 text-gray-700">
                        <span className="font-medium shrink-0">Điện thoại:</span>
                        <span>(+84) {address.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-700">
                        <span className="font-medium shrink-0">Địa chỉ:</span>
                        <span className="leading-relaxed">
                            {address.streetNumber}, {address.fullAddress}
                        </span>
                    </div>
                </div>

                {showActions && (
                    <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                        {onEdit && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onEdit(address); }}
                                className="text-theme bg-transparent border-none p-0 cursor-pointer font-medium text-[13px] transition-colors hover:text-theme-hover"
                            >
                                Chỉnh sửa
                            </button>
                        )}
                        {!address.isDefault && (
                            <>
                                {onDelete && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDelete(address.addressId); }}
                                        className="text-red-500 bg-transparent border-none p-0 cursor-pointer font-medium text-[13px] transition-colors"
                                    >
                                        Xóa
                                    </button>
                                )}
                                {onSetDefault && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onSetDefault(address.addressId); }}
                                        className="text-gray-600 bg-transparent border-none p-0 cursor-pointer font-medium text-[13px] hover:text-black transition-colors"
                                    >
                                        Thiết lập mặc định
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
            
            {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none rounded-tr-[8px]">
                    <div className="absolute top-[-24px] right-[-24px] w-12 h-12 bg-theme transform rotate-45"></div>
                    <svg className="absolute top-1 right-1 w-3.5 h-3.5 text-white z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default AddressCard;
