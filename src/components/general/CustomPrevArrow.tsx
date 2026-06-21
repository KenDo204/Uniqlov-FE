import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="absolute top-[40%] -left-3 md:-left-6 z-0 flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md cursor-pointer hover:bg-[#00927c] hover:text-white transition-all" onClick={onClick}>
      <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
    </div>
  );
};