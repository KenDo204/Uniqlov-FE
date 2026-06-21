import { useState, type Dispatch, type SetStateAction } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField
} from '@mui/material';

interface ConfirmCancelOrderModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    title: string;
    content: string;
    onConfirm: (reason: string) => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmCancelOrderModal = ({ 
    open, 
    setOpen, 
    title, 
    content, 
    onConfirm, 
    confirmText = "Xác nhận", 
    cancelText = "Hủy" 
}: ConfirmCancelOrderModalProps) => {

    const [reason, setReason] = useState("");

    const handleClose = () => {
        setOpen(false);
        setReason(""); // Reset on close
    };

    const handleConfirm = () => {
        onConfirm(reason);
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
                <DialogContentText id="confirm-dialog-description" sx={{ mb: 2 }}>
                    {content}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="reason"
                    label="Lý do hủy đơn"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    multiline
                    rows={3}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button 
                    onClick={handleClose} 
                    color="inherit"
                    sx={{ 
                        bgcolor: '#ee4d2d', 
                        font: '14pt',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        color: 'white',
                        '&:hover': { bgcolor: '#d73211' }
                    }}
                >
                    {cancelText}
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    variant="contained"
                    disableElevation
                    color="inherit"
                    disabled={!reason.trim()} // disable if no reason
                    sx={{ 
                        textTransform: 'uppercase', 
                        font: '14pt',
                        fontWeight: 'bold',
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmCancelOrderModal;
