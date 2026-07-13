import { AccountCircle, ShoppingCart, NoteAlt, FavoriteBorder } from '@mui/icons-material';

export const accountNavItems = [
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
];
