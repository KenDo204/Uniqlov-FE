export interface CategoryItem {
  category_id: number;
  category_code: string;
  category_name: string;
  icon_url: string;
  target_url: string; // Tương đương href cũ
}

export interface CategoryGroup {
  category_id: string; // 'women', 'men', 'kids', 'baby'
  category_name: string;
  items: CategoryItem[];
}

export const mockCategories: CategoryGroup[] = [
  {
    category_id: 'women',
    category_name: 'NỮ',
    items: [
      {
        category_id: 101,
        category_code: 'W_TOPS_TSHIRTS',
        category_name: 'ÁO THUN & ÁO NỈ',
        target_url: '/women/tops/t-shirts',
        icon_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80'
      },
      {
        category_id: 102,
        category_code: 'W_TOPS_SHIRTS',
        category_name: 'ÁO SƠ MI & ÁO KIỂU',
        target_url: '/women/tops/shirts',
        icon_url: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e98?w=300&q=80'
      },
      {
        category_id: 103,
        category_code: 'W_OUTERWEAR_JACKETS',
        category_name: 'ÁO KHOÁC',
        target_url: '/women/outerwear/jackets',
        icon_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80'
      },
      {
        category_id: 104,
        category_code: 'W_BOTTOMS_SKIRTS',
        category_name: 'CHÂN VÁY & ĐẦM',
        target_url: '/women/bottoms/skirts',
        icon_url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&q=80'
      },
      {
        category_id: 105,
        category_code: 'W_BOTTOMS_JEANS',
        category_name: 'QUẦN & JEANS',
        target_url: '/women/bottoms/jeans',
        icon_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80'
      },
      {
        category_id: 106,
        category_code: 'W_BOTTOMS_SHORTS',
        category_name: 'QUẦN SHORTS',
        target_url: '/women/bottoms/shorts',
        icon_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300&q=80'
      },
      {
        category_id: 107,
        category_code: 'W_INNER_BRAS',
        category_name: 'ÁO BRA TOP',
        target_url: '/women/innerwear/bras',
        icon_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&q=80'
      },
      {
        category_id: 108,
        category_code: 'W_INNER_AIRISM',
        category_name: 'ĐỒ MẶC TRONG',
        target_url: '/women/innerwear/airism',
        icon_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&q=80'
      },
      {
        category_id: 109,
        category_code: 'W_ACTIVEWEAR',
        category_name: 'ĐỒ THỂ THAO',
        target_url: '/women/activewear',
        icon_url: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=300&q=80'
      }
    ]
  },
  {
    category_id: 'men',
    category_name: 'NAM',
    items: [
      {
        category_id: 201,
        category_code: 'M_TOPS_TSHIRTS',
        category_name: 'ÁO THUN & POLO',
        target_url: '/men/tops/t-shirts',
        icon_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80'
      },
      {
        category_id: 202,
        category_code: 'M_TOPS_SHIRTS',
        category_name: 'ÁO SƠ MI',
        target_url: '/men/tops/shirts',
        icon_url: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e98?w=300&q=80'
      },
      {
        category_id: 203,
        category_code: 'M_OUTERWEAR_JACKETS',
        category_name: 'ÁO KHOÁC',
        target_url: '/men/outerwear/jackets',
        icon_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80'
      },
      {
        category_id: 204,
        category_code: 'M_BOTTOMS_JEANS',
        category_name: 'QUẦN JEANS',
        target_url: '/men/bottoms/jeans',
        icon_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80'
      },
      {
        category_id: 205,
        category_code: 'M_BOTTOMS_CHINOS',
        category_name: 'QUẦN CHINOS',
        target_url: '/men/bottoms/chinos',
        icon_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&q=80'
      },
      {
        category_id: 206,
        category_code: 'M_BOTTOMS_SHORTS',
        category_name: 'QUẦN SHORTS',
        target_url: '/men/bottoms/shorts',
        icon_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300&q=80'
      }
    ]
  },
  {
    category_id: 'kids',
    category_name: 'TRẺ EM',
    items: [
      {
        category_id: 301,
        category_code: 'K_TOPS_TSHIRTS',
        category_name: 'ÁO THUN',
        target_url: '/kids/tops/t-shirts',
        icon_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80'
      },
      {
        category_id: 302,
        category_code: 'K_OUTERWEAR',
        category_name: 'ÁO KHOÁC',
        target_url: '/kids/outerwear',
        icon_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80'
      },
      {
        category_id: 303,
        category_code: 'K_BOTTOMS',
        category_name: 'QUẦN & VÁY',
        target_url: '/kids/bottoms',
        icon_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80'
      },
      {
        category_id: 304,
        category_code: 'K_PAJAMAS',
        category_name: 'ĐỒ MẶC NHÀ',
        target_url: '/kids/pajamas',
        icon_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&q=80'
      }
    ]
  },
  {
    category_id: 'baby',
    category_name: 'EM BÉ',
    items: [
      {
        category_id: 401,
        category_code: 'B_NEWBORN',
        category_name: 'ĐỒ SƠ SINH (0-3M)',
        target_url: '/baby/newborn',
        icon_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80'
      },
      {
        category_id: 402,
        category_code: 'B_TODDLER',
        category_name: 'ÁO QUẦN (6M-5Y)',
        target_url: '/baby/toddler',
        icon_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&q=80'
      },
      {
        category_id: 403,
        category_code: 'B_INNERWEAR',
        category_name: 'ĐỒ NGỦ & NỘI Y',
        target_url: '/baby/innerwear',
        icon_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&q=80'
      }
    ]
  }
];