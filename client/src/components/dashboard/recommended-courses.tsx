import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { CourseCard } from "@/components/dashboard/course-card";
import { cn } from "@/lib/utils";
import { CourseCardSkeleton } from "@/components/shared/loading-state";
import { staggerContainer, fadeIn } from "@/lib/theme";

interface RecommendedCoursesProps {
  courses: Array<{
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: string;
    level: string;
    duration: number;
  }>;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function RecommendedCourses({
  courses = [],
  isLoading = false,
  onRefresh,
  className,
}: RecommendedCoursesProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 600); // Add a little delay for animation
  };

  return (
    <Card className={cn("backdrop-blur-md bg-card border-border/50", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Recommended For You</CardTitle>
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className={cn(isRefreshing && "animate-spin")}
              aria-label="Refresh recommendations"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-sm" aria-label="View all courses">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="h-[320px]">
                <CourseCardSkeleton />
              </div>
            ))
          ) : courses.length > 0 ? (
            // Courses
            courses.slice(0, 3).map((course) => (
              <motion.div key={course.id} variants={fadeIn}>
                <CourseCard {...course} />
              </motion.div>
            ))
          ) : (
            // No courses
            <div className="col-span-full py-10 text-center">
              <p className="text-muted-foreground">No courses to recommend at this time.</p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
