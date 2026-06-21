import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import {  GripVertical  } from '@/components/ui/icons'; // Icon tay cầm từ thư viện em đã cài

// Định nghĩa kiểu dữ liệu cho Banner
interface Slider {
  slider_id: string;
  image_url: string;
  display_order: number;
}

// Dữ liệu mẫu (Giả lập lấy từ API về)
const initialSliders: Slider[] = [
  { slider_id: '1', image_url: 'Banner Mùa Hè', display_order: 1 },
  { slider_id: '2', image_url: 'Banner Black Friday', display_order: 2 },
  { slider_id: '3', image_url: 'Banner Giáng Sinh', display_order: 3 },
];

export default function AdminSliderManager() {
  const [sliders, setSliders] = useState<Slider[]>(initialSliders);

  // Lõi thuật toán: Chạy khi người dùng thả chuột
  const handleDragEnd = (result: DropResult) => {
    // 1. Nếu thả ra ngoài danh sách thì bỏ qua
    if (!result.destination) return;

    // 2. Tạo bản sao của mảng hiện tại
    const items = Array.from(sliders);
    
    // 3. Cắt phần tử ở vị trí cũ ra (source.index)
    const [reorderedItem] = items.splice(result.source.index, 1);
    
    // 4. Nhét phần tử đó vào vị trí mới (destination.index)
    items.splice(result.destination.index, 0, reorderedItem);

    // 5. Cập nhật lại giao diện ngay lập tức
    setSliders(items);

    // 6. GỌI API XUỐNG SPRING BOOT Ở ĐÂY
    // Tạo một mảng chỉ chứa các ID theo thứ tự mới: ["2", "1", "3"]
    const newOrderIds = items.map(item => item.slider_id);
    console.log("Dữ liệu mảng ID gửi xuống Backend:", newOrderIds);
    // axios.put('/api/v1/sliders/reorder', newOrderIds);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Sắp xếp Banner (Kéo thả)</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slider-list">
            {(provided) => (
            <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
            >
                {sliders.map((slider, index) => (
                <Draggable key={slider.slider_id} draggableId={slider.slider_id} index={index}>
                    {(provided, snapshot) => (
                    <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center p-4 border rounded-md bg-slate-50 transition-colors
                        ${snapshot.isDragging ? 'bg-blue-100 border-blue-400 shadow-lg' : ''}
                        `}
                    >
                        {/* Các comment ở bên TRONG thẻ li này thì hoàn toàn hợp lệ, không bị lỗi */}
                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing mr-4 text-gray-500">
                        <GripVertical size={24} />
                        </div>
                        
                        <div className="flex-1 font-medium">
                        {slider.image_url}
                        </div>

                        <div className="text-sm text-gray-400">
                        Thứ tự: {index + 1}
                        </div>
                    </li>
                    )}
                </Draggable>
                ))}
                {provided.placeholder}
            </ul>
            )}
        </Droppable>
        </DragDropContext>
    </div>
  );
}