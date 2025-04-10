import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
  expanded?: boolean;
}

export function SearchBar({ 
  onSearch, 
  className,
  placeholder = "Search for courses...",
  expanded = false
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/browse-courses?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  const toggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSearch}>
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-center"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 pr-8 py-2 w-full bg-background border border-input rounded-full focus-visible:ring-1 focus-visible:ring-purple-500"
                  autoFocus
                />
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground p-0"
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={toggleExpand}
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
