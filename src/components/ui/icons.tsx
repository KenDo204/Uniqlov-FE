import * as React from 'react';
import {
  ErrorOutlined as MuiErrorOutline,
  ArrowBack as MuiArrowBack,
  ArrowForward as MuiArrowForward,
  MenuBook as MuiMenuBook,
  CheckCircle as MuiCheckCircle,
  ChevronLeft as MuiChevronLeft,
  ChevronRight as MuiChevronRight,
  AccessTime as MuiAccessTime,
  DeveloperBoard as MuiDeveloperBoard,
  CreditCard as MuiCreditCard,
  Visibility as MuiVisibility,
  VisibilityOff as MuiVisibilityOff,
  FilterList as MuiFilterList,
  FolderOpen as MuiFolderOpen,
  GridView as MuiGridView,
  DragIndicator as MuiDragIndicator,
  HelpOutlined as MuiHelpOutline,
  Home as MuiHome,
  Image as MuiImage,
  Info as MuiInfo,
  Dashboard as MuiDashboard,
  EnergySavingsLeaf as MuiLeaf,
  Lock as MuiLock,
  Logout as MuiLogout,
  Mail as MuiMail,
  LocationOn as MuiLocationOn,
  Menu as MuiMenu,
  Remove as MuiRemove,
  DarkMode as MuiDarkMode,
  Phone as MuiPhone,
  Add as MuiAdd,
  Recycling as MuiRecycling,
  Refresh as MuiRefresh,
  Search as MuiSearch,
  Send as MuiSend,
  Settings as MuiSettings,
  Share as MuiShare,
  Shield as MuiShield,
  ShoppingBag as MuiShoppingBag,
  ShoppingCart as MuiShoppingCart,
  AutoAwesome as MuiAutoAwesome,
  Store as MuiStore,
  LightMode as MuiLightMode,
  ConfirmationNumber as MuiConfirmationNumber,
  Upload as MuiUpload,
  Person as MuiPerson,
  People as MuiPeople,
  Close as MuiClose,
  Star as MuiStarFilled,
  StarBorder as MuiStarBorder,
  Favorite as MuiFavoriteFilled,
  FavoriteBorder as MuiFavoriteBorder,
  Checkroom as CheckroomIcon,
} from '@mui/icons-material';

// Helper to create a component compatible with lucide-react props (size, style, etc.)
function createIcon(MuiIconComponent: React.ComponentType<any>) {
  const Component = React.forwardRef(({ size, style, strokeWidth, ...props }: any, ref: any) => {
    const sizeStyle = size ? { width: size, height: size } : {};
    return (
      <MuiIconComponent
        ref={ref}
        style={{ ...sizeStyle, ...style }}
        {...props}
      />
    );
  });
  Component.displayName = MuiIconComponent.displayName || 'MuiIconWrapper';
  return Component;
}

export const AlertCircle = createIcon(MuiErrorOutline);
export const ArrowLeft = createIcon(MuiArrowBack);
export const ArrowRight = createIcon(MuiArrowForward);
export const BookOpen = createIcon(MuiMenuBook);
export const CheckCircle2 = createIcon(MuiCheckCircle);
export const ChevronLeft = createIcon(MuiChevronLeft);
export const ChevronLeftIcon = createIcon(MuiChevronLeft);
export const ChevronRight = createIcon(MuiChevronRight);
export const ChevronRightIcon = createIcon(MuiChevronRight);
export const Clock = createIcon(MuiAccessTime);
export const Cpu = createIcon(MuiDeveloperBoard);
export const CreditCard = createIcon(MuiCreditCard);
export const Eye = createIcon(MuiVisibility);
export const EyeOff = createIcon(MuiVisibilityOff);
export const Filter = createIcon(MuiFilterList);
export const FolderTree = createIcon(MuiFolderOpen);
export const Grid2X2 = createIcon(MuiGridView);
export const Grid3X3 = createIcon(MuiGridView);
export const GripVertical = createIcon(MuiDragIndicator);
export const HelpCircle = createIcon(MuiHelpOutline);
export const Home = createIcon(MuiHome);
export const Image = createIcon(MuiImage);
export const Info = createIcon(MuiInfo);
export const LayoutDashboard = createIcon(MuiDashboard);
export const Leaf = createIcon(MuiLeaf);
export const Lock = createIcon(MuiLock);
export const LogOut = createIcon(MuiLogout);
export const Mail = createIcon(MuiMail);
export const MapPin = createIcon(MuiLocationOn);
export const Menu = createIcon(MuiMenu);
export const Minus = createIcon(MuiRemove);
export const Moon = createIcon(MuiDarkMode);
export const Phone = createIcon(MuiPhone);
export const Plus = createIcon(MuiAdd);
export const Recycle = createIcon(MuiRecycling);
export const RefreshCw = createIcon(MuiRefresh);
export const Search = createIcon(MuiSearch);
export const Send = createIcon(MuiSend);
export const Settings = createIcon(MuiSettings);
export const Share2 = createIcon(MuiShare);
export const ShieldCheck = createIcon(MuiShield);
export const ShoppingBag = createIcon(MuiShoppingBag);
export const ShoppingCart = createIcon(MuiShoppingCart);
export const Sparkles = createIcon(MuiAutoAwesome);
export const Store = createIcon(MuiStore);
export const Sun = createIcon(MuiLightMode);
export const Ticket = createIcon(MuiConfirmationNumber);
export const Upload = createIcon(MuiUpload);
export const User = createIcon(MuiPerson);
export const Users = createIcon(MuiPeople);
export const X = createIcon(MuiClose);
export const Checkroom = createIcon(CheckroomIcon);

// Custom Star with dynamic outline/fill based on classes
export const Star = React.forwardRef(({ size, className, style, strokeWidth, ...props }: any, ref: any) => {
  const sizeStyle = size ? { width: size, height: size } : {};
  const isFilled = className?.includes('fill-') || props.fill === 'currentColor' || props.fill;
  const Component = isFilled ? MuiStarFilled : MuiStarBorder;
  return <Component ref={ref} className={className} style={{ ...sizeStyle, ...style }} {...props} />;
});
Star.displayName = 'Star';

// Custom Heart with dynamic outline/fill based on classes
export const Heart = React.forwardRef(({ size, className, style, strokeWidth, ...props }: any, ref: any) => {
  const sizeStyle = size ? { width: size, height: size } : {};
  const isFilled = className?.includes('fill-') || props.fill === 'currentColor' || props.fill;
  const Component = isFilled ? MuiFavoriteFilled : MuiFavoriteBorder;
  return <Component ref={ref} className={className} style={{ ...sizeStyle, ...style }} {...props} />;
});
Heart.displayName = 'Heart';
