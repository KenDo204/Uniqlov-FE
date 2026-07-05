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
    return (
        <div 
            className={`bg-white border p-5 rounded-2xl relative shadow-sm text-xs flex gap-3 transition-colors ${selectedValue === address.addressId ? 'border-[var(--color-theme)] bg-gray-50' : 'border-gray-200'} ${onSelect ? 'cursor-pointer hover:border-[var(--color-theme)]' : ''}`}
            onClick={() => onSelect && onSelect(address)}
        >
            {onSelect && (
                <div className="pt-1">
                    <Radio
                        checked={selectedValue === address.addressId}
                        onChange={() => onSelect(address)}
                        value={address.addressId}
                        name="address-radio"
                        sx={{
                            color: 'theme',
                            '&.Mui-checked': { color: 'theme' },
                            p: 0
                        }}
                    />
                </div>
            )}

            <div className="flex-1">
                {address.isDefault && (
                    <span className="absolute top-4 right-4 text-[9px] uppercase font-bold text-[var(--color-theme)] border border-[var(--color-theme)] px-1 py-0.5 rounded">
                        Mặc định
                    </span>
                )}
                
                <div className="space-y-1.5 font-light pt-1">
                    <p className="font-bold text-sm m-0 text-black">{address.recipientName}</p>
                    <p className="m-0 text-gray-700 font-medium">(+84) {address.phone}</p>
                    <p className="m-0 text-gray-500">{address.fullAddress}</p>
                    <p className="m-0 text-gray-400 italic">Số nhà, tên đường: {address.streetNumber}</p>
                </div>

                {showActions && (
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                        {onEdit && (
                            <button 
                                onClick={() => onEdit(address)}
                                className="text-blue-600 bg-transparent border-none p-0 cursor-pointer font-medium hover:underline text-[11px]"
                            >
                                Chỉnh sửa
                            </button>
                        )}
                        {!address.isDefault && (
                            <>
                                {onDelete && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <button 
                                            onClick={() => onDelete(address.addressId)}
                                            className="text-red-500 bg-transparent border-none p-0 cursor-pointer font-medium hover:underline text-[11px]"
                                        >
                                            Xóa
                                        </button>
                                    </>
                                )}
                                {onSetDefault && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <button 
                                            onClick={() => onSetDefault(address.addressId)}
                                            className="text-gray-600 bg-transparent border-none p-0 cursor-pointer font-medium hover:underline text-[11px]"
                                        >
                                            Đặt làm mặc định
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressCard;
