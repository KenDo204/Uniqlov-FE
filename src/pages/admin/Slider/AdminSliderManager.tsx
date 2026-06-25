import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { GripVertical } from '@/components/ui/icons';
import CustomPagination from '@/components/general/Pagination';

// Definition for Banner
interface Slider {
  slider_id: string;
  image_url: string;
  display_order: number;
}

// Sample data (mocked from API)
const initialSliders: Slider[] = [
  { slider_id: '1', image_url: 'Banner Mùa Hè', display_order: 1 },
  { slider_id: '2', image_url: 'Banner Black Friday', display_order: 2 },
  { slider_id: '3', image_url: 'Banner Giáng Sinh', display_order: 3 },
];

export default function AdminSliderManager() {
  const [sliders, setSliders] = useState<Slider[]>(initialSliders);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination slicing
  const paginatedSliders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sliders.slice(start, start + itemsPerPage);
  }, [sliders, currentPage]);

  // Drag and drop handler
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sliders);
    
    // Calculate global indexes based on current page
    const startOffset = (currentPage - 1) * itemsPerPage;
    const sourceIndex = startOffset + result.source.index;
    const destIndex = startOffset + result.destination.index;

    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, reorderedItem);

    setSliders(items);

    // Call API (simulated)
    const newOrderIds = items.map(item => item.slider_id);
    console.log("Dữ liệu mảng ID gửi xuống Backend:", newOrderIds);
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
                className="space-y-3 p-0 m-0 mb-4 list-none"
            >
                {paginatedSliders.map((slider, index) => (
                <Draggable key={slider.slider_id} draggableId={slider.slider_id} index={index}>
                    {(provided, snapshot) => (
                    <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center p-4 border rounded-md bg-slate-50 transition-colors
                        ${snapshot.isDragging ? 'bg-blue-100 border-blue-400 shadow-lg' : ''}
                        `}
                    >
                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing mr-4 text-gray-500">
                          <GripVertical size={24} />
                        </div>
                        
                        <div className="flex-1 font-medium text-left">
                          {slider.image_url}
                        </div>

                        <div className="text-sm text-gray-400">
                          Thứ tự: {(currentPage - 1) * itemsPerPage + index + 1}
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

      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(sliders.length / itemsPerPage)}
        totalItems={sliders.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}