import { type Dispatch, type SetStateAction } from "react";
import { Box, Button, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, Badge } from "@mui/material";
import { Home, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { ShoppingCart, ShoppingCartOutlined } from '@mui/icons-material';
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";
import { accountNavItems } from "@/config/navigation.config";
import React from "react";

export default function MobileNav({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
    const { user, logout } = useAuth();
    const { items, fetchCart } = useCart();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [fetchCart, user]);

    const totalQuantity = React.useMemo(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Đăng xuất thành công");
            navigate("/");
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
            navigate("/");
        }
        setIsOpen(false);
    }

    const DrawerList = (
        <Box sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }} role="presentation">
            {/* Header with Logo */}
            <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center' }}>
                <h1
                    onClick={() => { navigate("/"); setIsOpen(false); }}
                    className="logo cursor-pointer text-3xl font-bold text-theme m-0 font-sans"
                >
                    EasyMall
                </h1>
            </Box>

            {/* Main Links */}
            <List sx={{ flexGrow: 1, pt: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton sx={{ py: 2, px: 3 }} onClick={() => { navigate("/"); setIsOpen(false); }}>
                        <ListItemIcon sx={{ minWidth: 48 }}>
                            <Home sx={{ fontSize: 32, color: '#4b5563' }} />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 500, color: '#374151', fontFamily: 'var(--font-sans)' }}>
                                Trang chủ
                            </Typography>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />

            {/* Bottom Section: Login / Avatar */}
            <Box sx={{ p: 3, pb: 4 }}>
                {user === null ? (
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<AccountCircleIcon sx={{ fontSize: "1.5rem" }} />}
                        onClick={() => { navigate("/login"); setIsOpen(false); }}
                        sx={{
                            py: 1.5,
                            fontSize: '1.15rem',
                            fontWeight: 600,
                            borderRadius: '10px',
                            backgroundColor: 'theme',
                            textTransform: 'none',
                            fontFamily: 'var(--font-sans)',
                            '&:hover': { backgroundColor: '#007a68' }
                        }}
                    >
                        Đăng nhập
                    </Button>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/* User Info Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, px: 2 }}>
                            <Avatar
                                src={user?.avatar}
                                alt={user?.fullName || user?.email || 'User'}
                                sx={{ width: 48, height: 48, bgcolor: 'theme' }}
                            >
                                {user?.fullName ? user.fullName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U')}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', fontFamily: 'var(--font-sans)' }}>
                                    {user.fullName || "Tài khoản của tôi"}
                                </Typography>
                                <Typography sx={{ fontSize: '0.9rem', color: '#6b7280', fontFamily: 'var(--font-sans)' }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Divider sx={{ mb: 1 }} />

                        {/* Account Menu Items */}
                        <List disablePadding>
                            {accountNavItems.map((item) => {
                                const isCart = item.path === "/cart";
                                return (
                                    <ListItem disablePadding key={item.path}>
                                        <ListItemButton 
                                            sx={{ py: 1.5, px: 2, borderRadius: 1, '&:hover': { bgcolor: 'rgba(0, 146, 124, 0.04)' } }} 
                                            onClick={() => { navigate(item.path); setIsOpen(false); }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40, color: '#4b5563' }}>
                                                {isCart ? (
                                                    <Badge badgeContent={totalQuantity} color="error" max={99}>
                                                        {totalQuantity > 0 ? <ShoppingCart /> : <ShoppingCartOutlined />}
                                                    </Badge>
                                                ) : (
                                                    item.icon
                                                )}
                                            </ListItemIcon>
                                            <ListItemText>
                                                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#374151', fontFamily: 'var(--font-sans)' }}>
                                                    {item.title}
                                                </Typography>
                                            </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                            
                            {/* Admin Menu */}
                            {["ROLE_ADMIN", "ROLE_OWNER"].includes(user?.roleName || "") && (
                                <ListItem disablePadding>
                                    <ListItemButton 
                                        sx={{ 
                                            py: 1.5, px: 2, mt: 1, borderRadius: 1, 
                                            background: 'linear-gradient(to right, #00927c, #00927c)',
                                            color: 'white',
                                            '&:hover': { background: 'linear-gradient(to right, #007a68, #007a68)' }
                                        }} 
                                        onClick={() => { navigate("/admin"); setIsOpen(false); }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                                            <AdminPanelSettingsOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Typography sx={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                                                Trang Quản Trị Viên
                                            </Typography>
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </List>

                        <Divider sx={{ my: 2 }} />

                        {/* Logout Button */}
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<Logout sx={{ fontSize: "1.25rem" }} />}
                            onClick={() => { handleLogout(); setIsOpen(false); }}
                            sx={{
                                py: 1.25,
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                borderRadius: '10px',
                                color: '#dc2626',
                                borderColor: '#fca5a5',
                                textTransform: 'none',
                                fontFamily: 'var(--font-sans)',
                                '&:hover': { backgroundColor: '#fef2f2', borderColor: '#ef4444' }
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );

    return (
        <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
            {DrawerList}
        </Drawer>
    );
}