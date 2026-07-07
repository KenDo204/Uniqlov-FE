import { type Dispatch, type SetStateAction } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

interface ConfirmModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    title: string;
    content: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal = ({ 
    open, 
    setOpen, 
    title, 
    content, 
    onConfirm, 
    confirmText = "Xác nhận", 
    cancelText = "Hủy" 
}: ConfirmModalProps) => {

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 'bold' }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button 
                    onClick={handleClose} 
                    sx={{ 
                        bgcolor: 'var(--color-cancel)', 
                        font: '14pt',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        '&:hover': { bgcolor: 'var(--color-cancel-hover)' }
                    }}
                >
                    {cancelText}
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    autoFocus 
                    variant="contained"
                    disableElevation
                    sx={{ 
                        bgcolor: 'var(--color-theme)', 
                        textTransform: 'uppercase', 
                        font: '14pt',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: 'var(--color-theme-hover)' }
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;
