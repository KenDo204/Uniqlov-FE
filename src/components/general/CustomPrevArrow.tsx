import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div 
      className="absolute top-[40%] -translate-y-1/2 left-0 z-10 flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md cursor-pointer transition-all duration-300 opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-2 md:group-hover/slider:translate-x-4 hover:bg-[var(--color-theme)] hover:text-white hover:border-[var(--color-theme)] text-gray-600" 
      onClick={onClick}
    >
      <ArrowBackIosNewIcon sx={{ fontSize: 16, mr: '2px' }} />
    </div>
  );
};