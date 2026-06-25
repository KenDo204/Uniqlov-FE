import { type Dispatch, type SetStateAction } from "react";
import { Box, Button, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography } from "@mui/material";
import { FavoriteBorder, Home, Logout, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "@/hooks/useAuth";

export default function MobileNav({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
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
                    className="logo cursor-pointer text-3xl font-bold text-[#00927c] m-0 font-sans"
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
                <ListItem disablePadding>
                    <ListItemButton sx={{ py: 2, px: 3 }} onClick={() => { navigate("/account/wishlists"); setIsOpen(false); }}>
                        <ListItemIcon sx={{ minWidth: 48 }}>
                            <FavoriteBorder sx={{ fontSize: 32, color: '#4b5563' }} />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 500, color: '#374151', fontFamily: 'var(--font-sans)' }}>
                                Wishlist
                            </Typography>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton sx={{ py: 2, px: 3 }} onClick={() => { navigate("/search"); setIsOpen(false); }}>
                        <ListItemIcon sx={{ minWidth: 48 }}>
                            <Search sx={{ fontSize: 32, color: '#4b5563' }} />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 500, color: '#374151', fontFamily: 'var(--font-sans)' }}>
                                Tìm kiếm sản phẩm
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
                            backgroundColor: '#00927c',
                            textTransform: 'none',
                            fontFamily: 'var(--font-sans)',
                            '&:hover': { backgroundColor: '#007a68' }
                        }}
                    >
                        Đăng nhập
                    </Button>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }} onClick={() => {
                            setIsOpen(false);
                            navigate("/account/profile")
                        }} className="cursor-pointer">
                            <Avatar
                                src=""
                                alt={user.email}
                            >
                                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                            </Avatar>
                            <span className="text-lg font-medium text-gray-700">{user.fullName || "Tài khoản"}</span>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<Logout sx={{ fontSize: "1.5rem" }} />}
                            onClick={() => { handleLogout(); setIsOpen(false); }}
                            sx={{
                                py: 1.5,
                                fontSize: '1.15rem',
                                fontWeight: 600,
                                borderRadius: '10px',
                                backgroundColor: '#00927c',
                                textTransform: 'none',
                                fontFamily: 'var(--font-sans)',
                                '&:hover': { backgroundColor: '#007a68' }
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