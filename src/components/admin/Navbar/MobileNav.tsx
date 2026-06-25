import { type Dispatch, type SetStateAction } from "react";
import { Box, Button, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Image, Settings, Users, FolderTree, Checkroom, ShieldCheck, Lock, ShoppingBag, Ticket } from '@/components/ui/icons';
import { paths } from '@/config/paths';

export default function MobileNav({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
            navigate("/login");
        }
        setIsOpen(false);
    }

    const menuItems = [
      { label: 'Tổng quan', path: paths.admin.dashboard, icon: LayoutDashboard },
      { label: 'Quản lý Banners', path: paths.admin.banners, icon: Image },
      { label: 'Quản lý Thương hiệu', path: paths.admin.brands, icon: Settings },
      { label: 'Quản lý Danh mục', path: paths.admin.categories, icon: FolderTree },
      { label: 'Quản lý Sản phẩm', path: paths.admin.products, icon: Checkroom },
      { label: 'Quản lý Đơn hàng', path: paths.admin.orders, icon: ShoppingBag },
      { label: 'Quản lý Mã giảm giá', path: paths.admin.coupons, icon: Ticket },
      { label: 'Quản lý Người dùng', path: paths.admin.users, icon: Users },
      { label: 'Quản lý Vai trò', path: paths.admin.roles, icon: ShieldCheck },
      { label: 'Quản lý Quyền', path: paths.admin.permissions, icon: Lock },
    ];

    const DrawerList = (
        <Box sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }} role="presentation">
            {/* Header with Logo */}
            <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center' }}>
                <h1
                    onClick={() => { navigate("/admin"); setIsOpen(false); }}
                    className="logo cursor-pointer text-2xl font-bold text-[#00927c] m-0 font-sans"
                >
                    EasyMall Admin
                </h1>
            </Box>

            {/* Main Links */}
            <List sx={{ flexGrow: 1, pt: 2, overflowY: 'auto' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== paths.admin.dashboard && location.pathname.startsWith(item.path));
                    const Icon = item.icon;
                    return (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton 
                                sx={{ 
                                    py: 1.5, 
                                    px: 3,
                                    bgcolor: isActive ? 'rgba(0, 146, 124, 0.08)' : 'transparent',
                                    color: isActive ? '#00927c' : '#374151'
                                }} 
                                onClick={() => { navigate(item.path); setIsOpen(false); }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#00927c' : '#4b5563' }}>
                                    <Icon size={20} />
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography sx={{ fontSize: '1rem', fontWeight: isActive ? 600 : 500, fontFamily: 'var(--font-sans)' }}>
                                        {item.label}
                                    </Typography>
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            {/* Bottom Section */}
            <Box sx={{ p: 3, pb: 4 }}>
                {user && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                                src=""
                                alt={user.email}
                            >
                                {user.fullName ? user.fullName[0].toUpperCase() : 'A'}
                            </Avatar>
                            <span className="text-sm font-medium text-gray-700">{user.fullName}</span>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<Logout sx={{ fontSize: "1.25rem" }} />}
                            onClick={handleLogout}
                            sx={{
                                py: 1,
                                fontSize: '1rem',
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