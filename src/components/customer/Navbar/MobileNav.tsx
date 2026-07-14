import { Box, Button, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Logout, ExpandMore as ExpandMoreIcon, Home } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import React from "react";
import EasyMall_Logo from '@/assets/icons/logo.png';
import { BRAND } from "@/constants/brand";
import { useCategory } from "@/hooks/useCategory";
import { buildMegaMenuUrl } from "@/utils/urlHelpers";

export default function MobileNav({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { logout } = useAuth();
    const { categories, fetchPublicCategories } = useCategory();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isOpen && (!categories || categories.length === 0)) {
            fetchPublicCategories().catch(console.error);
        }
    }, [isOpen, categories, fetchPublicCategories]);

    const activeCategoriesList = React.useMemo(() => {
        return (categories || []).filter((c: any) => c.categoryStatus === 1 && (c.parentId === null || c.level === 1)).slice(0, 12);
    }, [categories]);

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
                <Link to="/" className="flex flex-col shrink-0 decoration-none group order-1 lg:w-[20%]">
                    <img
                        src={EasyMall_Logo}
                        alt={`${BRAND.NAME} Logo`}
                        className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
                    />
                </Link>
            </Box>

            {/* Main Links (Categories) */}
            <Box sx={{ flexGrow: 1, pt: 1, overflowY: 'auto' }}>
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ py: 1.5, px: 3 }} onClick={() => { navigate("/"); setIsOpen(false); }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Home sx={{ fontSize: 28, color: '#4b5563' }} />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography sx={{ fontSize: '1.15rem', fontWeight: 600, color: '#374151', fontFamily: 'var(--font-sans)' }}>
                                    Trang chủ
                                </Typography>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>

                <Box sx={{ px: 2, pb: 2 }}>
                    {activeCategoriesList.map((category) => {
                        const hasChildren = category.children && category.children.filter((c: any) => c.categoryStatus === 1).length > 0;
                        return (
                            <Accordion 
                                key={category.categoryId} 
                                disableGutters 
                                elevation={0}
                                sx={{
                                    '&:before': { display: 'none' },
                                    borderBottom: '1px solid #f3f4f6',
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={hasChildren ? <ExpandMoreIcon /> : null}
                                    sx={{ px: 1, py: 0, minHeight: 48, '& .MuiAccordionSummary-content': { my: 1.5 } }}
                                    onClick={(e) => {
                                        // Nếu KHÔNG CÓ con thì click vào cha sẽ điều hướng luôn
                                        if (!hasChildren) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(buildMegaMenuUrl(category, null));
                                            setIsOpen(false);
                                        }
                                        // Ngược lại (CÓ CON), Accordion tự động mở nhờ hành vi mặc định, không điều hướng
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <img 
                                            src={category.iconUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80'} 
                                            alt={category.categoryName} 
                                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} 
                                        />
                                        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                                            {category.categoryName}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                
                                {hasChildren && (
                                    <AccordionDetails sx={{ px: 1, py: 0, pb: 1 }}>
                                        <List disablePadding>
                                            {category.children.filter((c: any) => c.categoryStatus === 1).map((child: any) => (
                                                <ListItem disablePadding key={child.categoryId}>
                                                    <ListItemButton
                                                        sx={{ 
                                                            py: 1, px: 2, ml: 4, mb: 0.5, borderRadius: 1,
                                                            '&:hover': { bgcolor: 'rgba(0, 146, 124, 0.08)' }
                                                        }}
                                                        onClick={() => {
                                                            navigate(buildMegaMenuUrl(category, child));
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        <ListItemText>
                                                            <Typography sx={{ fontSize: '0.95rem', color: '#4b5563', fontFamily: 'var(--font-sans)', transition: 'color 0.2s', '&:hover': { color: 'var(--color-theme)' } }}>
                                                                {child.categoryName}
                                                            </Typography>
                                                        </ListItemText>
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </AccordionDetails>
                                )}
                            </Accordion>
                        );
                    })}
                </Box>
            </Box>

            <Divider />

            {/* Bottom Section: Login / Avatar */}
            <Box sx={{ p: 3, pb: 4 }}>
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
        </Box>
    );

    return (
        <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
            {DrawerList}
        </Drawer>
    );
}