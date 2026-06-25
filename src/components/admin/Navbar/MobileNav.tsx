// import { useState, type Dispatch, type SetStateAction } from "react";
// import { Box, Button, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar } from "@mui/material";
// import { FavoriteBorder, Home, Logout, Search } from "@mui/icons-material";
// import { useAppSelector } from "@/hooks/hooks";
// import { useNavigate } from "react-router-dom";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import AvatarNav from "../../customer/Navbar/AvatarNav";
// import { useAppDispatch } from "@/hooks/hooks";
// import { logout, logoutUserSlice } from "@/redux/slices/authSlice";
// import { useClerk, useUser } from "@clerk/clerk-react";

// export default function MobileNav({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
//     const user = useAppSelector((state) => state.authReducer.user);
//     const navigate = useNavigate();
//     const dispatch = useAppDispatch();
//     const { isSignedIn } = useUser();
//     const { signOut } = useClerk();

//     const handleLogout = async () => {
//         dispatch(logout());
//         if (isSignedIn) {
//             await signOut();
//         }
//         const { type } = await dispatch(logoutUserSlice());

//         if (type.search('rejected') === -1) {
//             navigate("/");
//         }
//         setIsOpen(false);
//     }

//     const DrawerList = (
//         <Box sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }} role="presentation">
//             {/* Header with Logo */}
//             <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center' }}>
//                 <h1
//                     onClick={() => { navigate("/"); setIsOpen(false); }}
//                     className="logo cursor-pointer text-3xl font-bold text-[#00927c] m-0"
//                 >
//                     ShopMe
//                 </h1>
//             </Box>

//             {/* Main Links */}
//             <List sx={{ flexGrow: 1, pt: 2 }}>
//                 <ListItem disablePadding>
//                     <ListItemButton sx={{ py: 2, px: 3 }} onClick={() => { navigate("/"); setIsOpen(false); }}>
//                         <ListItemIcon sx={{ minWidth: 48 }}>
//                             <Home sx={{ fontSize: 32, color: '#4b5563' }} />
//                         </ListItemIcon>
//                         <ListItemText
//                             primary="Trang chủ"
//                             primaryTypographyProps={{ fontSize: '1.25rem', fontWeight: 500, color: '#374151' }}
//                         />
//                     </ListItemButton>
//                 </ListItem>
//                 <ListItem disablePadding>
//                     <ListItemButton sx={{ py: 2, px: 3 }} onClick={() => { navigate("/wishlist"); setIsOpen(false); }}>
//                         <ListItemIcon sx={{ minWidth: 48 }}>
//                             <FavoriteBorder sx={{ fontSize: 32, color: '#4b5563' }} />
//                         </ListItemIcon>
//                         <ListItemText
//                             primary="Wishlist"
//                             primaryTypographyProps={{ fontSize: '1.25rem', fontWeight: 500, color: '#374151' }}
//                         />
//                     </ListItemButton>
//                 </ListItem>
//                 <ListItem disablePadding>
//                     <ListItemButton sx={{ py: 2, px: 3 }} onClick={() => { navigate("/search-products"); setIsOpen(false); }}>
//                         <ListItemIcon sx={{ minWidth: 48 }}>
//                             <Search sx={{ fontSize: 32, color: '#4b5563' }} />
//                         </ListItemIcon>
//                         <ListItemText
//                             primary="Tìm kiếm sản phẩm"
//                             primaryTypographyProps={{ fontSize: '1.25rem', fontWeight: 500, color: '#374151' }}
//                         />
//                     </ListItemButton>
//                 </ListItem>
//             </List>

//             <Divider />

//             {/* Bottom Section: Login / Avatar */}
//             <Box sx={{ p: 3, pb: 4 }}>
//                 {user === null ? (
//                     <Button
//                         fullWidth
//                         variant="contained"
//                         size="large"
//                         startIcon={<AccountCircleIcon sx={{ fontSize: "1.5rem" }} />}
//                         onClick={() => { navigate("/login"); setIsOpen(false); }}
//                         sx={{
//                             py: 1.5,
//                             fontSize: '1.15rem',
//                             fontWeight: 600,
//                             borderRadius: '10px',
//                             backgroundColor: '#00927c',
//                             textTransform: 'none',
//                             '&:hover': { backgroundColor: '#007a68' }
//                         }}
//                     >
//                         Đăng nhập
//                     </Button>
//                 ) : (
//                     <Box
//                         onClick={() => {
//                             setIsOpen(false);
//                             navigate("/account/profile")
//                         }}
//                         sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1 }}>
//                         {/* We use the AvatarNav when user is logged in. It will handle the menu popup. */}
//                         <Avatar
//                             src={user.avatar!}
//                             alt={user.email}
//                         />
//                         <span className="ml-3 text-lg font-medium text-gray-700">Tài khoản của bạn</span>
//                         <Button
//                             fullWidth
//                             variant="contained"
//                             size="large"
//                             startIcon={<Logout sx={{ fontSize: "1.5rem" }} />}
//                             onClick={() => { handleLogout(); setIsOpen(false); }}
//                             sx={{
//                                 py: 1.5,
//                                 fontSize: '1.15rem',
//                                 fontWeight: 600,
//                                 borderRadius: '10px',
//                                 backgroundColor: '#00927c',
//                                 textTransform: 'none',
//                                 '&:hover': { backgroundColor: '#007a68' }
//                             }}
//                         >
//                             Đăng xuất
//                         </Button>
//                     </Box>
//                 )}
//             </Box>
//         </Box>
//     );

//     return (
//         <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
//             {DrawerList}
//         </Drawer>
//     );
// }