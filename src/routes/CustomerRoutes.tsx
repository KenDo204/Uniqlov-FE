import { Navigate, type RouteObject } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import {
  CustomerHome,
  CustomerProductDetail,
  CustomerCart,
  CustomerCheckout,
  Login,
  Register,
  ProductListPage,
  Account,
  About,
  Sustainability,
  Help,
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
  ResetPassword,
  PaymentResult
} from '../pages/customer';

import ContactPage from '../pages/customer/Contact/ContactPage';
import MyContactHistory from '../pages/customer/Contact/MyContactHistory';
import OAuth2Redirect from '../pages/customer/auth/OAuth2Redirect';
import { GuestGuard } from './GuestGuard';

export const customerRoutes: RouteObject = {
  path: '/',
  element: <CustomerLayout />,
  children: [
    { path: '', element: <CustomerHome /> },
    { path: 'home', element: <CustomerHome /> },
    { path: 'products/:id', element: <CustomerProductDetail /> },
    { path: 'cart', element: <CustomerCart /> },
    { path: 'checkout', element: <CustomerCheckout /> },
    { path: 'oauth2/redirect', element: <OAuth2Redirect /> },
    {
      element: <GuestGuard />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'reset-password', element: <ResetPassword /> },
      ],
    },


    // UNILO routes
    { path: 'products', element: <ProductListPage /> },
    { path: 'products/:id', element: <CustomerProductDetail /> },
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
        { path: 'contacts', element: <MyContactHistory /> },
      ]
    },
    { path: 'about', element: <About /> },
    { path: 'sustainability', element: <Sustainability /> },
    { path: 'help', element: <Help /> },
    { path: 'contact', element: <ContactPage /> },
    { path: 'blog', element: <Blog /> },
    { path: 'blog/:id', element: <BlogArticle /> },
    { path: 'payment-result', element: <PaymentResult /> },
    { path: '*', element: <NotFound /> }
  ],
};

