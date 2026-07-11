import { Button, Container, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" className="animate-fade-in pb-16">
            <Box
                sx={{
                    mt: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: { xs: 3, sm: 5 },
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #f3f4f6'
                }}
            >
                <CheckCircleIcon sx={{ fontSize: 80, color: 'var(--color-theme)', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ color: 'var(--color-theme)', fontWeight: 'bold' }}>
                    Đặt hàng thành công!
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                    Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng của chúng tôi. 
                    Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, width: '100%', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(0, 146, 124, 0.08)', 
                            color: 'var(--color-theme)',
                            boxShadow: 'none',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'var(--color-theme)',
                                color: '#FFFFFF', 
                                boxShadow: '0 4px 10px rgba(0, 146, 124, 0.2)',
                                '& .MuiButton-startIcon': { transform: 'translateX(-4px)', transition: 'transform 0.3s ease' },
                            },
                            px: 4,
                            py: 1.5,
                            borderRadius: '8px'
                        }}
                        onClick={() => navigate('/')}
                    >
                        Tiếp tục mua sắm
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            color: '#FFFFFF',
                            backgroundColor: 'var(--color-theme)',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { 
                                backgroundColor: 'var(--color-theme-hover)',
                                boxShadow: '0 4px 10px rgba(0, 146, 124, 0.2)'
                            },
                            px: 4,
                            py: 1.5,
                            borderRadius: '8px'
                        }}
                        onClick={() => navigate('/account/orders')}
                    >
                        Xem đơn hàng
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default OrderSuccess;
