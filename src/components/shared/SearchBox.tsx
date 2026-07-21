import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Close as X} from "@mui/icons-material";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { buildSearchUrl } from "@/utils/urlHelpers";
import { useTracking } from "@/hooks/useTracking";
import { Source } from "@/types/tracking/requests";

interface SearchBoxProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

export function SearchBox({
  initialValue = "",
  placeholder = "Tìm kiếm...",
  className,
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { trackSearch } = useTracking();

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      trackSearch(trimmedQuery, 0, Source.HEADER_MEGA_MENU);
      navigate(buildSearchUrl(trimmedQuery));
    }
  };

  const handleChangeQuery = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value.trim().length > 200){
      return;
    }
    setQuery(e.target.value);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center w-full h-10 px-4 transition-all duration-300",
        "bg-gray-100/80 rounded-full hover:bg-gray-200/80",
        "focus-within:bg-white focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.08)] focus-within:ring-1 focus-within:ring-theme",
        className
      )}
    >
      <Search className="w-4 h-4 mr-2.5 text-gray-400 shrink-0" />
      
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChangeQuery}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-[14px] placeholder:text-gray-500 text-gray-800"
      />

      <div className="flex items-center space-x-1 shrink-0">
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-400 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
