import React from 'react'
import {
  Avatar, Popper, MenuItem, Fade, Paper, type PopperPlacementType,
  ListItemText, MenuList, ListItemIcon, Box, Divider, Typography
} from '@mui/material'
import { AccountCircle, Logout, ArrowDropDown } from '@mui/icons-material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface AuthUser {
  userId?: number;
  email: string;
  fullName: string;
  avatar?: string;
  role?: string;
  roleName?: string;
}

const navItem = [
  {
    title: "Hồ sơ của bạn",
    icon: <AccountCircle />,
    path: "/admin/profile"
  },
]

const AvatarNav = ({ admin }: { admin: AuthUser }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  
  const { logout: backendLogout } = useAuth();

  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleLogout = async () => {
    setOpen(false);
    
    try {
      await backendLogout();
      navigate("/login");
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      navigate("/login");
    }
  };

  const handleClick = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLElement>) => {
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
    <Box sx={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        sx={{
          cursor: "pointer",
          '&:hover': {
            opacity: 0.8,
            boxShadow: "0 0 0 2px #00927c",
            borderRadius: '50%',
            transition: "all 0.3s ease-in-out"
          }
        }}
        className='relative'
        onClick={handleClick('bottom-end')}
      >
        <Avatar src="" alt={admin?.fullName || admin?.email}>
          {admin?.fullName ? admin.fullName[0].toUpperCase() : 'A'}
        </Avatar>
        <ArrowDropDown sx={{ position: "absolute", bottom: -4, right: -4, fontSize: 22, color: "#00927c", bgcolor: 'white', borderRadius: '50%' }} />
      </Box>

      <Popper
        sx={{ zIndex: 1300 }}
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              sx={{
                width: 280,
                mt: 1.5,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <MenuList sx={{ p: 0 }}>
                {navItem.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => { setOpen(false); navigate(item.path); }}
                    sx={{ py: 1.5, '&:hover': { bgcolor: '#e6f4f1', color: '#00927c' } }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText>
                      <Typography sx={{ fontWeight: 500, fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}>
                        {item.title}
                      </Typography>
                    </ListItemText>
                  </MenuItem>
                ))}

                <Divider />

                <MenuItem
                  sx={{
                    background: 'linear-gradient(to right, #00927c, #00927c)',
                    color: 'white',
                    borderRadius: 1,
                    '&:hover': {
                      background: 'linear-gradient(to right, #00927c, #00927c)',
                      color: 'white',
                    }
                  }}
                  onClick={() => navigate("/")}
                >
                  <ListItemIcon>
                    <HomeOutlinedIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}>
                      Trang Chủ
                    </Typography>
                  </ListItemText>
                </MenuItem>

                <MenuItem
                  onClick={handleLogout}
                  sx={{ py: 1.5, color: '#dc2626', '&:hover': { bgcolor: '#fef2f2' } }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography sx={{ fontWeight: 500, fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}>
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
  )
}

export default AvatarNav;