export interface ApiResponse<T> {
  status: number;
  message: string;
  errorCode: string | null;
  data: T | null;
}

export interface Slider {
  slider_id: number;
  image_url: string;
  target_url: string;
  display_order: number;
}

// Cập nhật Interface Category để hỗ trợ danh mục con giống NavigationData
export interface CategoryItem {
  label: string;
  href: string;
  image: string;
}

export interface Category {
  category_id: string; // Chuyển sang dạng string (VD: 'women', 'men') để match FE
  label: string;
  items: CategoryItem[];
}

export interface PopularProduct {
  product_id: number;
  product_name: string;
  product_slug: string;
  product_description: string;
  thumbnail_url: string;
  price_range: string;
  product_tags: string[];
}

export interface CampaignBlock {
  id: string;
  title: string;
  subtitle: string;
  banner_url: string;
  tabs: string[];
  products: PopularProduct[]; // Dùng lại interface PopularProduct cho gọn
}

export interface AiRecommendations {
  user_recommendations: Array<{
    product_id: number;
    product_name: string;
    thumbnail_url: string;
    score: number;
  }>;
  product_similarities: Array<{
    similar_product_id: number;
    product_name: string;
    thumbnail_url: string;
    score: number;
  }>;
}

export interface HomeData {
  sliders: Slider[];
//   categories: Category[]; // Đã cập nhật
  campaignBlocks: CampaignBlock[];
  popularProducts: PopularProduct[];
  aiRecommendations: AiRecommendations;
}

export const mockDataHome: ApiResponse<HomeData> = {
  status: 200,
  message: "Lấy dữ liệu trang chủ thành công",
  errorCode: null,
  data: {
    sliders: [
      {
        slider_id: 1,
        image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
        target_url: "/collections/summer-sale",
        display_order: 1
      },
      {
        slider_id: 2,
        image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
        target_url: "/collections/vintage",
        display_order: 2
      }
    ],
    campaignBlocks: [
      {
        id: "ao-thun",
        title: "ÁO THUN CỔ TRÒN",
        subtitle: 'Trải nghiệm vải Cool Touch mát lạnh, vải Waffle "biết thở", Supima Cotton mềm mịn và công nghệ co giãn Ultra Stretch.',
        banner_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&q=80",
        tabs: ["Chỉ từ 87k", "Bán chạy", "Hàng mới", "Tay ngắn", "Tay dài", "Ba lỗ"],
        products: [
          { product_id: 1, product_name: "Áo Thun Thoáng Mát AirDry™ Ít Nhăn", product_slug: "ao-thun-1", product_description: "", thumbnail_url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80", price_range: "67.000đ", product_tags: [] },
          { product_id: 2, product_name: "Áo Thun 3 Lỗ Thể Thao Vải Hexagon", product_slug: "ao-thun-2", product_description: "", thumbnail_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", price_range: "67.000đ", product_tags: [] },
          { product_id: 3, product_name: "Áo Thun AirDry™ Vải Cotton Washed", product_slug: "ao-thun-3", product_description: "", thumbnail_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80", price_range: "97.000đ", product_tags: [] },
          { product_id: 4, product_name: "Áo Thun Raglan ColorLock™ Thoáng", product_slug: "ao-thun-4", product_description: "", thumbnail_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80", price_range: "147.000đ", product_tags: [] },
        ]
      },
      {
        id: "quan-jeans",
        title: "QUẦN JEANS",
        subtitle: "Trải nghiệm mát lạnh từ Quần Jeans Coolmax®, sự tự tin khử mùi của S.Cafe®, và Jeans đen bền màu.",
        banner_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1600&q=80",
        tabs: ["Dáng ôm vừa (Slim Fit)", "Dáng rộng (Loose Fit)", "Dáng tiêu chuẩn", "Quần Jeans Jogger", "Quần Jeans Short"],
        products: [
          { product_id: 5, product_name: "Quần Jean FlexFit™ Rách Gối Bụi Bặm", product_slug: "quan-jean-1", product_description: "", thumbnail_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", price_range: "228.500đ", product_tags: [] },
          { product_id: 6, product_name: "Quần Jean Wash Nhẹ FlexFit™ Co Giãn", product_slug: "quan-jean-2", product_description: "", thumbnail_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80", price_range: "247.000đ", product_tags: [] },
          { product_id: 7, product_name: "Quần Jean Vải DurableTex™ Mặc Bền", product_slug: "quan-jean-3", product_description: "", thumbnail_url: "https://images.unsplash.com/photo-1608063615781-e2ef8c13d114?w=600&q=80", price_range: "339.150đ", product_tags: [] },
          { product_id: 8, product_name: "Quần Jean ColorLock™ Giữ Màu Đen", product_slug: "quan-jean-4", product_description: "", thumbnail_url: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=600&q=80", price_range: "453.150đ", product_tags: [] },
        ]
      },
      {
        id: "ao-khoac",
        title: "ÁO KHOÁC",
        subtitle: "Trang bị lớp chắn hoàn hảo cho mọi chuyến đi. Chất liệu chống thấm, cản gió nhưng vẫn đảm bảo sự thông thoáng và mỏng nhẹ.",
        banner_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1600&q=80",
        tabs: ["Bán chạy", "Áo khoác dù", "Áo khoác Kaki", "Áo khoác nỉ", "Chống tia UV"],
        products: [
          { 
            product_id: 9, 
            product_name: "Áo Khoác Dù RainShield™ Trượt Nước", 
            product_slug: "ao-khoac-1", 
            product_description: "", 
            thumbnail_url: "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=600&q=80", 
            price_range: "297.000đ", 
            product_tags: [] 
          },
          { 
            product_id: 10, 
            product_name: "Áo Khoác Kaki 2 Lớp Đứng Form", 
            product_slug: "ao-khoac-2", 
            product_description: "", 
            thumbnail_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80", 
            price_range: "350.000đ", 
            product_tags: [] 
          },
          { 
            product_id: 11, 
            product_name: "Áo Khoác Nỉ French Terry Dày Dặn", 
            product_slug: "ao-khoac-3", 
            product_description: "", 
            thumbnail_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80", 
            price_range: "250.000đ", 
            product_tags: [] 
          },
          { 
            product_id: 12, 
            product_name: "Áo Khoác Chống Tia UV IceVibes™", 
            product_slug: "ao-khoac-4", 
            product_description: "", 
            thumbnail_url: "https://images.unsplash.com/photo-1580870059781-a757ccb0a7cb?w=600&q=80", 
            price_range: "199.000đ", 
            product_tags: [] 
          },
        ]
      }
    ],

    popularProducts: [
      {
        product_id: 101,
        product_name: "Áo Polo Fred Perry M12 Vintage",
        product_slug: "ao-polo-fred-perry-m12-vintage",
        product_description: "Dòng M12 huyền thoại của Fred Perry với viền sọc đôi đặc trưng.",
        thumbnail_url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
        price_range: "2.500.000đ",
        product_tags: ["vintage", "polo", "classic"]
      },
      {
        product_id: 102,
        product_name: "Giày Mizuno Wave Rider 27",
        product_slug: "giay-mizuno-wave-rider-27",
        product_description: "Giày chạy bộ cao cấp mang lại sự êm ái và phản hồi lực tối đa.",
        thumbnail_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        price_range: "3.100.000đ",
        product_tags: ["sneaker", "running", "mizuno"]
      }
    ],
    aiRecommendations: {
      user_recommendations: [
        {
          product_id: 105,
          product_name: "Áo Sơ Mi Nam Tay Ngắn Họa Tiết",
          thumbnail_url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
          score: 0.95
        }
      ],
      product_similarities: [
        {
          similar_product_id: 106,
          product_name: "Áo Polo Lacoste L.12.12",
          thumbnail_url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99",
          score: 0.88
        }
      ]
    }
  }
};