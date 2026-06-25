import { Navigate, type RouteObject } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import {
  CustomerHome,
  CustomerProductDetail,
  CustomerCart,
  CustomerCheckout,
  Login,
  Register,
  Collection,
  Search,
  Account,
  About,
  Sustainability,
  Help,
  Contact,
  Blog,
  BlogArticle,
  NotFound,
  ForgotPassword,
  Orders,
  Wishlists,
  Reviews,
  ProfileDetails,
  Addresses,
  ChangePassword,
  ResetPassword
} from '../pages/customer';

export const customerRoutes: RouteObject = {
  path: '/',
  element: <CustomerLayout />,
  children: [
    { path: '', element: <CustomerHome /> },
    { path: 'home', element: <CustomerHome /> },
    { path: 'product/:id', element: <CustomerProductDetail /> },
    { path: 'cart', element: <CustomerCart /> },
    { path: 'checkout', element: <CustomerCheckout /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'forgot-password', element: <ForgotPassword /> },
    { path: 'reset-password', element: <ResetPassword /> },
    // UNILO routes
    { path: 'men', element: <Collection /> },
    { path: 'women', element: <Collection /> },
    { path: 'new-arrivals', element: <Collection /> },
    { path: 'best-sellers', element: <Collection /> },
    { path: 'seasonal-essentials', element: <Collection /> },
    { path: 'product/:id', element: <CustomerProductDetail /> },
    { path: 'search', element: <Search /> },
    { path: 'cart', element: <CustomerCart /> },
    { path: 'checkout', element: <CustomerCheckout /> },
    { 
      path: 'account', 
      element: <Account />,
      children: [
        { index: true, element: <Navigate to="orders" replace /> }, 
        { path: 'orders', element: <Orders /> },
        { path: 'wishlists', element: <Wishlists /> },
        { path: 'reviews', element: <Reviews /> },
        { path: 'profile', element: <ProfileDetails /> },
        { path: 'addresses', element: <Addresses /> },
        { path: 'password', element: <ChangePassword /> },
      ]
    },
    { path: 'about', element: <About /> },
    { path: 'sustainability', element: <Sustainability /> },
    { path: 'help', element: <Help /> },
    { path: 'contact', element: <Contact /> },
    { path: 'blog', element: <Blog /> },
    { path: 'blog/:id', element: <BlogArticle /> },
    { path: '*', element: <NotFound /> }
  ],
};

