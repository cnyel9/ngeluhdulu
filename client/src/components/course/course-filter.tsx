import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseFilterProps {
  onFilter: (filters: CourseFilters) => void;
  onReset?: () => void;
  className?: string;
}

export interface CourseFilters {
  search: string;
  categories: string[];
  levels: string[];
  duration: [number, number]; // Min and max duration in minutes
}

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Design",
  "Business",
  "Marketing",
  "Photography",
  "Music",
];

const LEVELS = ["beginner", "intermediate", "advanced"];

export function CourseFilter({ onFilter, onReset, className }: CourseFilterProps) {
  const [filters, setFilters] = useState<CourseFilters>({
    search: "",
    categories: [],
    levels: [],
    duration: [0, 480], // 0 to 8 hours
  });
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };
  
  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== category),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category],
        };
      }
    });
  };
  
  const handleLevelToggle = (level: string) => {
    setFilters((prev) => {
      if (prev.levels.includes(level)) {
        return {
          ...prev,
          levels: prev.levels.filter((l) => l !== level),
        };
      } else {
        return {
          ...prev,
          levels: [...prev.levels, level],
        };
      }
    });
  };
  
  const handleDurationChange = (values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      duration: [values[0], values[1]] as [number, number],
    }));
  };
  
  const handleApplyFilters = () => {
    const newFilterCount = 
      filters.categories.length + 
      filters.levels.length + 
      (filters.duration[0] > 0 || filters.duration[1] < 480 ? 1 : 0);
    
    setActiveFilterCount(newFilterCount);
    onFilter(filters);
    setShowMobileFilters(false);
  };
  
  const handleResetFilters = () => {
    setFilters({
      search: "",
      categories: [],
      levels: [],
      duration: [0, 480],
    });
    setActiveFilterCount(0);
    if (onReset) onReset();
    setShowMobileFilters(false);
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  // Mobile filter drawer
  const mobileFilters = (
    <AnimatePresence>
      {showMobileFilters && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setShowMobileFilters(false)}
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm z-50 border-l bg-background p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`mobile-category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label
                        htmlFor={`mobile-category-${category}`}
                        className="ml-2 cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Level</h3>
                <div className="space-y-2">
                  {LEVELS.map((level) => (
                    <div key={level} className="flex items-center">
                      <Checkbox
                        id={`mobile-level-${level}`}
                        checked={filters.levels.includes(level)}
                        onCheckedChange={() => handleLevelToggle(level)}
                      />
                      <Label
                        htmlFor={`mobile-level-${level}`}
                        className="ml-2 cursor-pointer capitalize"
                      >
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Duration</h3>
                <div className="px-2">
                  <Slider
                    value={[filters.duration[0], filters.duration[1]]}
                    min={0}
                    max={480}
                    step={30}
                    onValueChange={handleDurationChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{formatDuration(filters.duration[0])}</span>
                    <span>{formatDuration(filters.duration[1])}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  
  return (
    <div className={className}>
      {/* Desktop filter */}
      <div className="hidden md:block">
        <div className="space-y-6">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-9 pr-3"
              />
            </div>
          </div>
          
          <Accordion type="multiple" defaultValue={["categories", "level", "duration"]}>
            <AccordionItem value="categories" className="border-b">
              <AccordionTrigger className="py-3">Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label
                        htmlFor={`category-${category}`}
                        className="ml-2 cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="level" className="border-b">
              <AccordionTrigger className="py-3">Level</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {LEVELS.map((level) => (
                    <div key={level} className="flex items-center">
                      <Checkbox
                        id={`level-${level}`}
                        checked={filters.levels.includes(level)}
                        onCheckedChange={() => handleLevelToggle(level)}
                      />
                      <Label
                        htmlFor={`level-${level}`}
                        className="ml-2 cursor-pointer capitalize"
                      >
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="duration" className="border-b">
              <AccordionTrigger className="py-3">Duration</AccordionTrigger>
              <AccordionContent>
                <div className="px-2 pt-2">
                  <Slider
                    value={[filters.duration[0], filters.duration[1]]}
                    min={0}
                    max={480}
                    step={30}
                    onValueChange={handleDurationChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{formatDuration(filters.duration[0])}</span>
                    <span>{formatDuration(filters.duration[1])}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="space-y-3 pt-3">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile filter toggle */}
      <div className="md:hidden">
        <div className="flex space-x-2 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-9 pr-3"
            />
          </div>
          
          <Button
            variant="outline"
            className="flex-shrink-0"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
        
        {/* Applied filter chips on mobile */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.categories.map((category) => (
              <Badge
                key={`chip-${category}`}
                variant="secondary"
                className="rounded-full py-1 px-3"
              >
                {category}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleCategoryToggle(category)}
                />
              </Badge>
            ))}
            
            {filters.levels.map((level) => (
              <Badge
                key={`chip-${level}`}
                variant="secondary"
                className="rounded-full py-1 px-3 capitalize"
              >
                {level}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleLevelToggle(level)}
                />
              </Badge>
            ))}
            
            {(filters.duration[0] > 0 || filters.duration[1] < 480) && (
              <Badge
                variant="secondary"
                className="rounded-full py-1 px-3"
              >
                {formatDuration(filters.duration[0])} - {formatDuration(filters.duration[1])}
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {mobileFilters}
    </div>
  );
}
