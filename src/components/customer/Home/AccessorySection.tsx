interface AccessoryCardProps {
  img: string;
  title: string;
  price: string;
  height?: string;
  flex?: number;
}

export function AccessorySection() {
  return (
    <section className="bg-[#f8f8f8] py-20 mt-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold uppercase mb-3 tracking-wide">Phụ Kiện Thời Trang</h3>
          <p className="text-sm text-gray-500">Những món đồ cần thiết và tiện dụng mỗi ngày</p>
        </div>

        {/* Tabs phụ kiện */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 uppercase text-xs md:text-sm font-semibold tracking-wider">
          <button className="bg-black text-white px-8 py-2.5 rounded-full border-none cursor-pointer hover:bg-gray-800 transition-colors">NÓN</button>
          <button className="text-gray-400 hover:text-black bg-transparent border-none cursor-pointer transition-colors">VÍ</button>
          <button className="text-gray-400 hover:text-black bg-transparent border-none cursor-pointer transition-colors">DÂY NỊT</button>
          <button className="text-gray-400 hover:text-black bg-transparent border-none cursor-pointer transition-colors">TÚI ĐEO</button>
        </div>

        {/* Grid Phụ Kiện (Bento Box Layout) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

          {/* Cột 1 (2 ảnh dọc) */}
          <div className="flex flex-col gap-4 md:gap-6">
            <AccessoryCard img="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" title="LƯỚI MESH THOÁNG" price="68.000đ" />
            <AccessoryCard img="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80" title="KAKI ĐỨNG FORM" price="68.000đ" height="h-full" />
          </div>

          {/* Cột 2 (Ảnh to ở giữa chiếm 2 hàng) */}
          <div className="md:col-span-1 row-span-2 hidden md:block">
            <div className="w-full h-full bg-white relative group overflow-hidden cursor-pointer shadow-sm">
              <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" alt="Center" className="w-full h-[70%] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-[60%] left-0 w-full h-[40%] bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end items-center pb-8 text-white">
                <h4 className="font-bold uppercase tracking-wider mb-2 text-lg">DÙ MỎNG NHẸ</h4>
                <span className="text-xl font-bold">61.000đ</span>
              </div>
            </div>
          </div>

          {/* Cột 3 & 4 (Các ảnh nhỏ còn lại) */}
          <div className="flex flex-col gap-4 md:gap-6">
            <AccessoryCard img="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80" title="DÙ LỖ LAZER" price="103.000đ" />
            <div className="flex gap-4 md:gap-6 h-full">
              <AccessoryCard img="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80" title="GẤP GỌN" price="103.000đ" flex={1} />
              <AccessoryCard img="https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&q=80" title="KAKI MỀM" price="103.000đ" flex={1} />
            </div>
          </div>

          <div className="hidden md:block">
            <AccessoryCard img="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80" title="BỀN BỈ" price="103.000đ" height="h-[100%]" />
          </div>

        </div>

        <div className="text-center mt-12">
          <button className="px-10 py-3 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer">
            XEM TẤT CẢ NÓN
          </button>
        </div>
      </div>
    </section>
  );
}

function AccessoryCard({ img, title, price, height = "h-[220px]", flex }: AccessoryCardProps) {
  return (
    <div className={`w-full bg-white shadow-sm overflow-hidden group cursor-pointer relative ${height} ${flex ? 'flex-1' : ''}`}>
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      {/* Lớp phủ đen dưới chân thẻ ảnh */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-4 flex flex-col items-center text-white">
        <h5 className="text-[11px] font-bold uppercase tracking-wider mb-1">{title}</h5>
        <span className="text-[14px] font-bold">{price}</span>
        {/* Fake swatches màu */}
        <div className="flex gap-1 mt-2">
          <div className="w-2 h-2 rounded-full bg-white opacity-80" />
          <div className="w-2 h-2 rounded-full bg-gray-400 opacity-80" />
          <div className="w-2 h-2 rounded-full bg-gray-800 opacity-80" />
        </div>
      </div>
    </div>
  );
}
