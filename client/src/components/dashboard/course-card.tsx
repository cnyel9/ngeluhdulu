import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Clock, BookmarkIcon, BookmarkPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { hoverScale } from "@/lib/theme";
import { useToast } from "@/hooks/use-toast";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  level: string;
  duration: number;
  progress?: number;
  isBookmarked?: boolean;
  className?: string;
}

export function CourseCard({
  id,
  title,
  description,
  thumbnailUrl,
  category,
  level,
  duration,
  progress = 0,
  isBookmarked = false,
  className,
}: CourseCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const levelColorMap = {
    beginner: "bg-green-500",
    intermediate: "bg-blue-500",
    advanced: "bg-purple-500",
  };

  const formattedDuration = duration >= 60 
    ? `${Math.floor(duration / 60)}h ${duration % 60}m` 
    : `${duration}m`;

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (bookmarked) {
        await apiRequest("DELETE", `/api/courses/${id}/bookmark`);
        toast({
          title: "Bookmark removed",
          description: "Course removed from your bookmarks",
        });
      } else {
        await apiRequest("POST", `/api/courses/${id}/bookmark`);
        toast({
          title: "Bookmarked!",
          description: "Course added to your bookmarks",
        });
      }
      setBookmarked(!bookmarked);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  const truncateDescription = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Link href={`/course/${id}`}>
      <motion.div
        className={cn("cursor-pointer", className)}
        whileHover={hoverScale}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="overflow-hidden h-full flex flex-col bg-card border-border/50 backdrop-blur-sm">
          <div className="relative">
            {/* Thumbnail */}
            <div className="aspect-video w-full h-48 overflow-hidden">
              <img
                src={thumbnailUrl || `https://source.unsplash.com/random/600x400/?${encodeURIComponent(category.toLowerCase())}`}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500"
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              />
            </div>
            
            {/* Level Badge */}
            <Badge 
              className={cn(
                "absolute top-3 left-3",
                level === "beginner" ? "bg-green-500 hover:bg-green-600" :
                level === "intermediate" ? "bg-blue-500 hover:bg-blue-600" :
                "bg-purple-500 hover:bg-purple-600"
              )}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Badge>
            
            {/* Bookmark Button */}
            <button
              className={cn(
                "absolute top-3 right-3 p-1.5 rounded-full transition-colors",
                bookmarked 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background/80 text-foreground hover:bg-background/90"
              )}
              onClick={toggleBookmark}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? (
                <BookmarkIcon className="h-4 w-4" />
              ) : (
                <BookmarkPlus className="h-4 w-4" />
              )}
            </button>
            
            {/* Progress Indicator (if started) */}
            {progress > 0 && (
              <div className="absolute -bottom-5 right-3">
                <ProgressRing 
                  progress={progress} 
                  size={40} 
                  strokeWidth={3} 
                  className="bg-background border border-border rounded-full shadow-lg" 
                />
              </div>
            )}
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold line-clamp-2 mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {truncateDescription(description)}
            </p>
            
            <div className="mt-auto flex items-center justify-between">
              <Badge variant="outline" className="flex items-center text-xs">
                <Clock className="mr-1 h-3 w-3" /> {formattedDuration}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {category}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
