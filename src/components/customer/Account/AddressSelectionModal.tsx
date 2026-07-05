import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Radio,
    Box,
    CircularProgress,
    Divider
} from '@mui/material';
import type { AddressResponse } from '@/types/address';

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
    // state to keep track of the selected address before confirming
    const [tempSelected, setTempSelected] = React.useState<AddressResponse | null>(null);

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
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
                Địa Chỉ Của Tôi
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={30} sx={{ color: 'theme' }} />
                    </Box>
                ) : addresses.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="textSecondary">Bạn chưa có địa chỉ nào.</Typography>
                    </Box>
                ) : (
                    <List sx={{ pt: 0, maxHeight: 400, overflowY: 'auto' }}>
                        {addresses.map((address) => (
                            <React.Fragment key={address.addressId}>
                                <ListItem disablePadding>
                                    <ListItemButton 
                                        onClick={() => setTempSelected(address)}
                                        sx={{ 
                                            py: 2, 
                                            px: 3,
                                            '&:hover': { bgcolor: 'rgba(0,146,124,0.04)' }
                                        }}
                                    >
                                        <Radio
                                            checked={tempSelected?.addressId === address.addressId}
                                            sx={{
                                                color: 'theme',
                                                '&.Mui-checked': { color: 'theme' },
                                                mr: 1,
                                                ml: -1
                                            }}
                                        />
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontWeight: 'bold' }} variant="body1">
                                                        {address.recipientName}
                                                    </Typography>
                                                    <Divider orientation="vertical" flexItem sx={{ height: 14, my: 'auto' }} />
                                                    <Typography variant="body2" color="textSecondary">
                                                        {address.phone}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {address.streetNumber}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {address.fullAddress}
                                                    </Typography>
                                                    {address.isDefault && (
                                                        <Box 
                                                            component="span" 
                                                            sx={{ 
                                                                mt: 1, 
                                                                display: 'inline-block',
                                                                border: '1px solid theme', 
                                                                color: 'theme', 
                                                                fontSize: '10px', 
                                                                px: 0.5, 
                                                                borderRadius: '2px' 
                                                            }}
                                                        >
                                                            Mặc Định
                                                        </Box>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                <Button onClick={onClose} variant="outlined" sx={{ 
                    color: '#000', borderColor: '#d1d5db', px: 3, fontWeight: 'bold', fontSize: '14px',
                    '&:hover': { bgcolor: "#f3f4f6", borderColor: '#d1d5db' } }}>
                    Hủy
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    variant="contained" 
                    disabled={!tempSelected}
                    sx={{ bgcolor: 'theme', px: 3, fontWeight: 'bold', '&:hover': { bgcolor: '#007a68' } }}
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddressSelectionModal;
