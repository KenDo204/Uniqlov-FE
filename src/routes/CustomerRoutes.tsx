import type { RouteObject } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import {
  CustomerHome,
  CustomerProductDetail,
  CustomerCart,
  CustomerCheckout,
  Collection,
  Search,
  Account,
  Wishlist,
  StoreLocator,
  About,
  Sustainability,
  Help,
  Contact,
  Blog,
  BlogArticle,
  NotFound
} from '../pages/customer';

export const customerRoutes: RouteObject = {
  path: '/',
  element: <CustomerLayout />,
  children: [
    { path: '', element: <CustomerHome /> },
    { path: 'customer/home', element: <CustomerHome /> },
    { path: 'customer/product/:id', element: <CustomerProductDetail /> },
    { path: 'customer/cart', element: <CustomerCart /> },
    { path: 'customer/checkout', element: <CustomerCheckout /> },

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
    { path: 'account', element: <Account /> },
    { path: 'wishlist', element: <Wishlist /> },
    { path: 'store-locator', element: <StoreLocator /> },
    { path: 'about', element: <About /> },
    { path: 'sustainability', element: <Sustainability /> },
    { path: 'help', element: <Help /> },
    { path: 'contact', element: <Contact /> },
    { path: 'blog', element: <Blog /> },
    { path: 'blog/:id', element: <BlogArticle /> },
    { path: '*', element: <NotFound /> }
  ],
};

