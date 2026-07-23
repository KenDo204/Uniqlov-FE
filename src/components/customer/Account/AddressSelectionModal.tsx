import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import type { AddressResponse } from '@/types/address';
import ConfirmModal from '@/components/general/ConfirmModal';
import AddressCard from './AddressCard';
import CreateAddressModal from './createAdressModal';
import UpdateAddressModal from './updateAddressModal';
import { useAddress } from '@/hooks/useAddress';
import { toast } from 'react-toastify';

interface AddressSelectionModalProps {
    open: boolean;
    onClose: () => void;
    addresses: AddressResponse[];
    selectedAddressId: number | null;
    onSelect: (address: AddressResponse) => void;
    loading?: boolean;
}

const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({
    open,
    onClose,
    addresses,
    selectedAddressId,
    onSelect,
    loading = false
}) => {
    const { fetchAddresses, deleteAddress, setDefaultAddress } = useAddress();
    const [tempSelected, setTempSelected] = React.useState<AddressResponse | null>(null);

    // Edit Modal state
    const [createOpen, setCreateOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState<AddressResponse | null>(null);

    React.useEffect(() => {
        if (open) {
            const current = addresses.find(a => a.addressId === selectedAddressId) || null;
            setTempSelected(current);
        }
    }, [open, selectedAddressId, addresses]);

    const handleConfirm = () => {
        if (tempSelected) {
            onSelect(tempSelected);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
            try {
                await deleteAddress(id);
                toast.success("Xóa địa chỉ thành công!");
                fetchAddresses();
                if (tempSelected?.addressId === id) setTempSelected(null);
            } catch (err: any) {
                toast.error(err || "Lỗi khi xóa địa chỉ");
            }
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultAddress(id);
            toast.success("Đặt địa chỉ mặc định thành công!");
            fetchAddresses();
        } catch (err: any) {
            toast.error(err || "Lỗi khi đặt địa chỉ mặc định");
        }
    };

    const handleOpenUpdate = (addr: AddressResponse) => {
        setAddressToEdit(addr);
        setUpdateOpen(true);
    };

    const modalContent = (
        <Box sx={{ mt: 1 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress size={30} sx={{ color: 'var(--color-theme)' }} />
                </Box>
            ) : addresses.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="textSecondary">Bạn chưa có địa chỉ nào.</Typography>
                </Box>
            ) : (
                <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-1 pb-2 scrollbar-thin">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.addressId}
                            address={address}
                            selectedValue={tempSelected?.addressId}
                            onSelect={(addr) => setTempSelected(addr)}
                            onEdit={handleOpenUpdate}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                            showActions={true}
                        />
                    ))}
                </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
                <button 
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="w-full py-3 bg-white border border-dashed border-theme text-theme font-medium rounded-[4px] hover:bg-[rgba(0,146,124,0.05)] transition-colors cursor-pointer"
                >
                    + Thêm địa chỉ mới
                </button>
            </div>
            
            <CreateAddressModal 
                open={createOpen} 
                setOpen={setCreateOpen} 
                onCreated={(newAddr) => {
                    setTempSelected(newAddr);
                    onSelect(newAddr);
                    onClose();
                }}
            />
            <UpdateAddressModal open={updateOpen} setOpen={setUpdateOpen} address={addressToEdit} />
        </Box>
    );

    return (
        <ConfirmModal
            open={open}
            setOpen={(val) => {
                if (!val) onClose();
            }}
            title="Địa Chỉ Của Tôi"
            content={modalContent}
            onConfirm={handleConfirm}
            confirmText="Xác nhận"
            cancelText="Hủy"
            confirmDisabled={!tempSelected}
            maxWidth="sm"
        />
    );
};

export default AddressSelectionModal;
