// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Search, X, Loader2, Mic, MicOff } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "@/hooks/hooks";
// import { sendTrackingBatchThunk } from "@/redux/slices/trackingSlice";

// /**
//  * Props for SearchProduct component:
//  * @param onSearch Callback to trigger fetch API from searchSlice.
//  * @param results Matching products from Redux state.
//  * @param loading Loading status from Redux state.
//  * @param onSelect Callback when a user selects a result.
//  */
// interface SearchProductProps {
//   onSearch: (query: string) => void;
//   results: string[];
//   loading: boolean;
//   onSelect?: (product: string) => void;
//   placeholder?: string;
//   className?: string;
//   initialValue?: string;
// }

// const SearchProduct: React.FC<SearchProductProps> = ({
//   onSearch,
//   results = [],
//   loading = false,
//   onSelect,
//   placeholder = "Tìm kiếm sản phẩm...",
//   className,
//   initialValue = "",
// }) => {
//   const [query, setQuery] = useState(initialValue);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [isListening, setIsListening] = useState(false);
//   const recognitionRef = useRef<any>(null);
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     if (initialValue !== undefined) {
//       setQuery(initialValue);
//     }
//   }, [initialValue]);

//   // Initialize Web Speech API
//   useEffect(() => {
//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = true; // Enable real-time transcription
//       recognition.lang = "vi-VN";

//       recognition.onstart = () => setIsListening(true);
//       recognition.onend = () => setIsListening(false);
//       recognition.onerror = (event: any) => {
//         console.error("Speech recognition error:", event.error);
//         setIsListening(false);
//       };
      
//       recognition.onresult = (event: any) => {
//         let currentTranscript = "";
//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           currentTranscript += event.results[i][0].transcript;
//         }
        
//         if (currentTranscript) {
//           setQuery(currentTranscript);
//           setIsOpen(true);
//         }
//       };

//       recognitionRef.current = recognition;
//     }
//   }, []);

//   const toggleListening = () => {
//     if (isListening) {
//       recognitionRef.current?.stop();
//     } else {
//       try {
//         if (!recognitionRef.current) {
//           alert("Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.");
//           return;
//         }
//         recognitionRef.current.start();
//       } catch (err) {
//         console.error("Speech recognition start error:", err);
//       }
//     }
//   };


//   // Handle closing dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const isFirstRender = useRef(true);

//   // Debounced search
//   useEffect(() => {
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       return;
//     }

//     const timer = setTimeout(() => {
//       onSearch(query);
//     }, 300); // 300ms debounce
//     return () => clearTimeout(timer);
//   }, [query]);

//   const handleClear = () => {
//     setQuery("");
//     setIsOpen(false);
//     inputRef.current?.focus();
//   };

//   const handleSelectResult = (result: string) => {
//     setQuery(result);
//     setIsOpen(false);
    
//     // Tracking search behavior when selecting from dropdown
//     dispatch(sendTrackingBatchThunk({
//       behaviors: [{
//         action_type: "SEARCH",
//         keyword: result,
//       }]
//     }));

//     onSelect?.(result);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const trimmedQuery = query.trim();
//     if (trimmedQuery) {
//       setIsOpen(false);
      
//       // Tracking search behavior when submitting via Enter/Submit
//       dispatch(sendTrackingBatchThunk({
//         behaviors: [{
//           action_type: "SEARCH",
//           keyword: trimmedQuery,
//         }]
//       }));

//       // If the parent provided an onSelect handler, use it (and don't jump to /products)
//       if (onSelect) {
//         onSelect(trimmedQuery);
//         return;
//       }

//       navigate(`/products?q=${encodeURIComponent(trimmedQuery)}`);
//     }
//   }

//   return (
//     <div 
//       className={cn("relative w-full max-w-[600px] group", className)}
//       ref={dropdownRef}
//     >
//       {/* Search Input Container */}
//       <form
//       onSubmit={handleSubmit}
//         className={cn(
//           "flex items-center w-full min-h-[46px] px-4 py-2 transition-all duration-300",
//           "bg-white border rounded-full hover:shadow-lg",
//           "focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary-color/20 focus-within:border-transparent"
//         )}
//       >
//         <Search className="w-5 h-5 mr-3 text-gray-400 group-focus-within:text-primary-color transition-colors" />
        
//         <input
//           ref={inputRef}
//           type="text"
//           value={query}
//           onChange={(e) => {
//             setQuery(e.target.value);
//             setIsOpen(true);
//           }}
//           onFocus={() => setIsOpen(true)}
//           placeholder={placeholder}
//           className="w-full bg-transparent border-none outline-none text-[15px] placeholder:text-gray-400 text-gray-700"
//         />

//         <div className="flex items-center space-x-1">
//           {loading && (
//             <Loader2 className="w-4 h-4 text-primary animate-spin mr-1" />
//           )}

//           <button
//             type="button"
//             onClick={toggleListening}
//             title={isListening ? "Đang nghe..." : "Tìm kiếm bằng giọng nói"}
//             className={cn(
//               "p-2 rounded-full transition-all duration-200",
//               isListening
//                 ? "bg-red-50 text-red-500 animate-pulse shadow-inner"
//                 : "hover:bg-gray-100 text-gray-400 hover:text-primary-color"
//             )}
//           >
//             {isListening ? (
//               <MicOff className="w-4 h-4" />
//             ) : (
//               <Mic className="w-4 h-4" />
//             )}
//           </button>

//           {query && (
//             <button
//               type="button" // Critical: prevents Enter key from triggering this button as a submit
//               onClick={handleClear}
//               className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
//             >
//               <X className="w-4 h-4 font-bold" />
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Results Dropdown (Google Style) */}
//       {isOpen && (query.trim() !== "") && (
//         <div 
//           className={cn(
//             "absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 shadow-xl z-50",
//             "rounded-[24px] overflow-hidden transition-all duration-200 ease-out py-2 animate-in fade-in slide-in-from-top-2",
//             results.length === 0 && !loading ? "hidden" : ""
//           )}
//         >
//           {results.length > 0 ? (
//             <div className="flex flex-col">
//               {results.slice(0, 10).map((item, index) => (
//                 <div
//                   key={index}
//                   onClick={() => handleSelectResult(item)}
//                   className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors group"
//                 >
//                   <Search className="w-4 h-4 mr-3 text-gray-300 group-hover:text-primary transition-colors" />
//                   <span className="text-sm font-medium text-gray-700">{item}</span>
//                 </div>
//               ))}
//             </div>
//           ) : loading ? (
//              <div className="px-4 py-4 text-center text-sm text-gray-400 italic">
//                Đang tìm kiếm...
//              </div>
//           ) : (
//             <div className="px-4 py-4 text-center text-sm text-gray-400 italic">
//               Không tìm thấy sản phẩm nào
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchProduct;
