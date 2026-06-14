export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export interface NavigationFeatured {
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface CategoryNavigation {
  id: string;
  label: string;
  groups: NavigationGroup[];
  featured: NavigationFeatured;
}

export const NAVIGATION_DATA: CategoryNavigation[] = [
  {
    id: 'women',
    label: 'WOMEN',
    groups: [
      {
        title: 'TOPS',
        items: [
          { label: 'T-Shirts & Tops', href: '/women/tops/t-shirts' },
          { label: 'Shirts & Blouses', href: '/women/tops/shirts' },
          { label: 'Sweaters & Cardigans', href: '/women/tops/sweaters' },
          { label: 'Hoodies & Sweatshirts', href: '/women/tops/sweatshirts' },
          { label: 'UT (Graphic T-Shirts)', href: '/women/tops/ut-graphic-tshirts' },
        ],
      },
      {
        title: 'OUTERWEAR',
        items: [
          { label: 'Jackets & Coats', href: '/women/outerwear/jackets-coats' },
          { label: 'Ultra Light Down', href: '/women/outerwear/ultra-light-down' },
          { label: 'Blazers & Vests', href: '/women/outerwear/blazers-vests' },
          { label: 'Parkas', href: '/women/outerwear/parkas' },
        ],
      },
      {
        title: 'BOTTOMS',
        items: [
          { label: 'Jeans & Denim', href: '/women/bottoms/jeans' },
          { label: 'Trousers & Slacks', href: '/women/bottoms/trousers' },
          { label: 'Skirts', href: '/women/bottoms/skirts' },
          { label: 'Shorts', href: '/women/bottoms/shorts' },
          { label: 'Leggings & Activewear', href: '/women/bottoms/leggings' },
        ],
      },
      {
        title: 'INNERWEAR & LOUNGE',
        items: [
          { label: 'AIRism Innerwear', href: '/women/innerwear/airism' },
          { label: 'HEATTECH Thermal', href: '/women/innerwear/heattech' },
          { label: 'Bras & Undies', href: '/women/innerwear/bras-underwear' },
          { label: 'Loungewear & Pajamas', href: '/women/innerwear/loungewear' },
          { label: 'Socks & Hosiery', href: '/women/innerwear/socks' },
        ],
      },
    ],
    featured: {
      title: 'AIRism Collection',
      description: 'Discover breathable, moisture-wicking everyday essentials designed to keep you cool and dry.',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=500&auto=format&fit=crop',
      href: '/collections/airism',
    },
  },
  {
    id: 'men',
    label: 'MEN',
    groups: [
      {
        title: 'TOPS',
        items: [
          { label: 'T-Shirts & Polos', href: '/men/tops/t-shirts' },
          { label: 'Casual & Dress Shirts', href: '/men/tops/shirts' },
          { label: 'Sweaters & Cardigans', href: '/men/tops/sweaters' },
          { label: 'Hoodies & Sweatshirts', href: '/men/tops/sweatshirts' },
          { label: 'UT (Graphic T-Shirts)', href: '/men/tops/ut-graphic-tshirts' },
        ],
      },
      {
        title: 'OUTERWEAR',
        items: [
          { label: 'Jackets & Coats', href: '/men/outerwear/jackets-coats' },
          { label: 'Ultra Light Down', href: '/men/outerwear/ultra-light-down' },
          { label: 'Parkas & Blousons', href: '/men/outerwear/parkas' },
        ],
      },
      {
        title: 'BOTTOMS',
        items: [
          { label: 'Jeans & Denim', href: '/men/bottoms/jeans' },
          { label: 'Chinos & Trousers', href: '/men/bottoms/chinos' },
          { label: 'Easy Pants & Joggers', href: '/men/bottoms/joggers' },
          { label: 'Shorts', href: '/men/bottoms/shorts' },
        ],
      },
      {
        title: 'INNERWEAR & LOUNGE',
        items: [
          { label: 'AIRism Performance', href: '/men/innerwear/airism' },
          { label: 'HEATTECH Thermal', href: '/men/innerwear/heattech' },
          { label: 'Boxers & Briefs', href: '/men/innerwear/underwear' },
          { label: 'Loungewear & Pajamas', href: '/men/innerwear/loungewear' },
          { label: 'Socks', href: '/men/innerwear/socks' },
        ],
      },
    ],
    featured: {
      title: 'Modern Tailoring',
      description: 'Elevated essentials that bridge the gap between office wear and weekend comfort.',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=500&auto=format&fit=crop',
      href: '/collections/men-classics',
    },
  },
  {
    id: 'kids',
    label: 'KIDS',
    groups: [
      {
        title: 'TOPS',
        items: [
          { label: 'T-Shirts & Tops', href: '/kids/tops/t-shirts' },
          { label: 'Shirts & Polos', href: '/kids/tops/shirts' },
          { label: 'Sweatshirts & Hoodies', href: '/kids/tops/sweatshirts' },
        ],
      },
      {
        title: 'OUTERWEAR',
        items: [
          { label: 'Jackets & Coats', href: '/kids/outerwear/jackets-coats' },
          { label: 'Ultra Light Down', href: '/kids/outerwear/ultra-light-down' },
        ],
      },
      {
        title: 'BOTTOMS',
        items: [
          { label: 'Pants & Jeans', href: '/kids/bottoms/pants' },
          { label: 'Shorts', href: '/kids/bottoms/shorts' },
          { label: 'Skirts & Leggings', href: '/kids/bottoms/skirts' },
        ],
      },
      {
        title: 'INNERWEAR & PAJAMAS',
        items: [
          { label: 'Innerwear & Socks', href: '/kids/innerwear' },
          { label: 'Pajamas & Loungewear', href: '/kids/pajamas' },
        ],
      },
    ],
    featured: {
      title: 'Kids Comfort collection',
      description: 'Stretchy, durable fabrics that let them run, play, and explore comfortably all day long.',
      image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=500&auto=format&fit=crop',
      href: '/collections/kids-comfort',
    },
  },
  {
    id: 'baby',
    label: 'BABY',
    groups: [
      {
        title: 'NEWBORN (0-3M)',
        items: [
          { label: 'One-Pieces & Bodysuits', href: '/baby/newborn/one-pieces' },
          { label: 'Swaddles & Sleepers', href: '/baby/newborn/sleepers' },
          { label: 'Innerwear', href: '/baby/newborn/innerwear' },
        ],
      },
      {
        title: 'TODDLER (6M-5Y)',
        items: [
          { label: 'T-Shirts & Tops', href: '/baby/toddler/tops' },
          { label: 'Pants & Leggings', href: '/baby/toddler/pants' },
          { label: 'Pajamas', href: '/baby/toddler/pajamas' },
          { label: 'Outerwear', href: '/baby/toddler/outerwear' },
        ],
      },
    ],
    featured: {
      title: '100% Organic Cotton',
      description: 'Ultra-soft, skin-friendly cotton items crafted with care for the most sensitive skin.',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=500&auto=format&fit=crop',
      href: '/collections/baby-organic',
    },
  },
];
