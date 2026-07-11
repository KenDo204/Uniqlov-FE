import { type Dispatch, type SetStateAction, type ReactNode } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box
} from '@mui/material';

interface ConfirmModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    title: string;
    content: ReactNode | string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmDisabled?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const ConfirmModal = ({ 
    open, 
    setOpen, 
    title, 
    content, 
    onConfirm, 
    confirmText = "Xác nhận", 
    cancelText = "Hủy",
    confirmDisabled = false,
    maxWidth = "xs"
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
            maxWidth={maxWidth}
            fullWidth
        >
            <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 'bold' }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ pb: typeof content === 'string' ? undefined : 0 }}>
                {typeof content === 'string' ? (
                    <DialogContentText id="confirm-dialog-description">
                        {content}
                    </DialogContentText>
                ) : (
                    <Box id="confirm-dialog-description">
                        {content}
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                <Button 
                    onClick={handleClose} 
                    sx={{ 
                        bgcolor: 'var(--color-cancel)', 
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: 'white',
                        '&:hover': { bgcolor: 'var(--color-cancel-hover)' }
                    }}
                >
                    {cancelText}
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    disabled={confirmDisabled}
                    autoFocus 
                    variant="contained"
                    disableElevation
                    sx={{ 
                        bgcolor: 'var(--color-theme)', 
                        textTransform: 'uppercase', 
                        fontSize: '14px',
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
