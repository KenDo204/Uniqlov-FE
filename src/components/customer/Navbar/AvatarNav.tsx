import React from 'react'
import { Avatar, Popper, Fade, Paper, type PopperPlacementType, ListItemText, MenuList, ListItemIcon, Divider, Box, Badge, Typography, MenuItem } from '@mui/material'
import { Storefront, NoteAlt, FavoriteBorder, Logout, AccountCircle, ShoppingCart, ArrowDropDown, ShoppingCartOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { logoutThunk, clearAuth } from '@/stores/slices/authSlice'
import { useClerk, useUser } from '@clerk/clerk-react'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

interface AuthUser {
  userId?: number;
  email: string;
  fullName: string;
  avatar?: string;
  role?: string;
}

const navItem = [
  {
    title: "Hồ sơ của bạn",
    icon: <AccountCircle />,
    path: "/account/profile"
  },
  {
    title: "Giỏ hàng của tôi",
    icon: <ShoppingCart />,
    path: "/cart"
  },
  {
    title: "Lịch sử mua hàng",
    icon: <NoteAlt />,
    path: "/account/orders"
  },
  {
    title: "Danh sách yêu thích",
    icon: <FavoriteBorder />,
    path: "/wishlist"
  },
]

const AvatarNav = ({ user }: { user: AuthUser }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector(state => state.cart);
  const [open, setOpen] = React.useState(false);
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleLogout = async () => {
    setOpen(false);
    if (isSignedIn) {
      await signOut({ redirectUrl: "/" });
    }
    await dispatch(logoutThunk());
    dispatch(clearAuth());
    navigate("/");
  }

  const becomeSellerClick = () => {
    setOpen(false);
    if (user.role === "ROLE_SELLER" || user.role === "ROLE_SUPER_SELLER") {
      navigate("/seller")
    } else navigate("/become-seller")
  }

  const handleClick =
    (newPlacement: PopperPlacementType) =>
      (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
      };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box sx={{ cursor: "pointer", '&:hover': { opacity: 0.8, boxShadow: "0 0 0 1px #00927c", borderRadius: '50%', transition: "all 0.3s ease-in-out" } }}
          className='relative' onClick={handleClick('bottom-start')}>
          <Avatar
            src={user.avatar!}
            alt={user.email}
          />
          <ArrowDropDown sx={{ position: "absolute", bottom: -4, right: -4, fontSize: 22, color: "#00927c" }} />
        </Box>


        <Popper
          sx={{ zIndex: 1200 }}
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          transition

        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ width: 300 }}>
                <MenuList>
                  {navItem.map((item) => {
                    const isCart = item.path === "/cart";
                    const hasItems = items && items.length > 0;

                    return (
                      <MenuItem
                        key={item.path}
                        onClick={() => { setOpen(false); navigate(item.path) }}
                        sx={{ py: 1, borderRadius: 1, my: 0.5, mx: 1, '&:hover': { bgcolor: 'rgba(0, 146, 124, 0.04)' } }}
                      >
                        <ListItemIcon>
                          {isCart ? (
                            <Badge badgeContent={hasItems ? items.length : 0} color="error">
                              {hasItems ? <ShoppingCart /> : <ShoppingCartOutlined />}
                            </Badge>
                          ) : (
                            item.icon
                          )}
                        </ListItemIcon>
                        <ListItemText>
                          <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>
                            {item.title}
                          </Typography>
                        </ListItemText>
                      </MenuItem>
                    );
                  })}
                  <Divider />
                  {["ROLE_ADMIN", "ROLE_SUPER_ADMIN"].includes(user?.role || "") ? (
                    <MenuItem
                      sx={{
                        background: 'linear-gradient(to right, #00927c, #00927c)',
                        color: 'white',
                        borderRadius: 1,
                        '&:hover': {
                          background: 'linear-gradient(to right, #00927c, #00927c)',
                          color: 'white',
                        }
                      }
                      }
                      onClick={() => navigate("/admin")}>
                      <ListItemIcon>
                        <AdminPanelSettingsOutlinedIcon
                          sx={{
                            color: 'white',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText>Trang Quản Trị Viên</ListItemText>
                    </MenuItem>
                  ) : 
                  (user?.role === "ROLE_SELLER" || user?.role === "ROLE_SUPER_SELLER") ? (
                    <MenuItem
                      sx={{
                        background: 'linear-gradient(to right, #00927c, #00927c)',
                        color: 'white',
                        borderRadius: 1,
                        '&:hover': {
                          background: 'linear-gradient(to right, #00927c, #00927c)',
                          color: 'white',
                        }
                      }
                      }
                      onClick={() => navigate("/seller")}>
                      <ListItemIcon>
                        <Storefront
                          sx={{
                            color: 'white',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText>Kênh người bán</ListItemText>
                    </MenuItem>
                  ) : (
                    (user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUPER_ADMIN" || user?.role === "ROLE_SUPER_SELLER") ? (
                      ''
                    ) : (
                        <MenuItem
                        sx={{
                          background: 'linear-gradient(to right, #00927c, #00927c)',
                          color: 'white',
                          borderRadius: 1,
                          '&:hover': {
                            background: 'linear-gradient(to right, #00927c, #00927c)',
                            color: 'white',
                          }
                        }
                        }
                        onClick={becomeSellerClick}>
                        <ListItemIcon>
                          <Storefront sx={{
                            color: 'white',
                          }}
                          />
                        </ListItemIcon>
                        <ListItemText>Trở thành người bán</ListItemText>
                      </MenuItem>
                      )
                    )
                  }
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ py: 1.5, color: '#dc2626', '&:hover': { bgcolor: '#fef2f2' } }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography sx={{ fontWeight: 500 }}>
                        Đăng xuất
                      </Typography>
                    </ListItemText>
                  </MenuItem>
                </MenuList>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>

    </>
  )
}

export default AvatarNav