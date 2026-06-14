export const paths = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  admin: {
    dashboard: '/admin/dashboard',
    banners: '/admin/banners',
    brands: '/admin/brands',
    categories: '/admin/categories',
    users: '/admin/users',
  },
  owner: {
    dashboard: '/owner/dashboard',
    orders: '/owner/orders',
    products: '/owner/products',
  },
  customer: {
    home: '/',
    homeOld: '/customer/home',
    men: '/men',
    women: '/women',
    newArrivals: '/new-arrivals',
    bestSellers: '/best-sellers',
    seasonalEssentials: '/seasonal-essentials',
    productDetail: '/product/:id',
    productDetailOld: '/customer/product/:id',
    search: '/search',
    cart: '/cart',
    cartOld: '/customer/cart',
    checkout: '/checkout',
    checkoutOld: '/customer/checkout',
    account: '/account',
    wishlist: '/wishlist',
    storeLocator: '/store-locator',
    about: '/about',
    sustainability: '/sustainability',
    help: '/help',
    contact: '/contact',
    blog: '/blog',
    blogArticle: '/blog/:id',
  },
} as const;

export type Paths = typeof paths;

