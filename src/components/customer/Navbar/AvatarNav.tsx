import React from 'react'
import { Avatar, Popper, Fade, Paper, type PopperPlacementType, ListItemText, MenuList, ListItemIcon, Divider, Box, Badge, Typography, MenuItem } from '@mui/material'
import { NoteAlt, FavoriteBorder, Logout, AccountCircle, ShoppingCart, ArrowDropDown, ShoppingCartOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { type UserResponse } from '@/types/auth'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { toast } from 'react-toastify';

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
    path: "/account/wishlists"
  },
]

const AvatarNav = ({ user }: { user: UserResponse | null }) => {
  const navigate = useNavigate();
  const { items, fetchCart } = useCart();
  const [open, setOpen] = React.useState(false);
  const { logout } = useAuth();
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  const totalQuantity = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      toast.success("Đăng xuất thành công");
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      navigate("/");
    }
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
            src=""
            alt={user?.fullName || user?.email || 'User'}
          >
            {user?.fullName ? user.fullName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U')}
          </Avatar>
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

                    return (
                      <MenuItem
                        key={item.path}
                        onClick={() => { setOpen(false); navigate(item.path) }}
                        sx={{ py: 1, borderRadius: 1, my: 0.5, mx: 1, '&:hover': { bgcolor: 'rgba(0, 146, 124, 0.04)' } }}
                      >
                        <ListItemIcon>
                          {isCart ? (
                            <Badge badgeContent={totalQuantity} color="error" max={99}>
                              {totalQuantity > 0 ? <ShoppingCart /> : <ShoppingCartOutlined />}
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
                  {["ROLE_ADMIN", "ROLE_OWNER"].includes(user?.roleName || "") ? (
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
                      <ListItemText>
                        <Typography sx={{ fontWeight: 500 }}>
                          Trang Quản Trị Viên
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                  ) : ""
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