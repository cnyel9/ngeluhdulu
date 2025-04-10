import { motion } from "framer-motion";
import { CourseCard } from "@/components/dashboard/course-card";
import { staggerContainer, fadeIn } from "@/lib/theme";
import { Course } from "@shared/schema";
import { CourseGridSkeleton } from "@/components/shared/loading-state";

interface CourseGridProps {
  courses: Course[];
  isLoading?: boolean;
  emptyMessage?: string;
  bookmarkedCourses?: number[];
  className?: string;
}

export function CourseGrid({
  courses,
  isLoading = false,
  emptyMessage = "No courses found",
  bookmarkedCourses = [],
  className,
}: CourseGridProps) {
  if (isLoading) {
    return <CourseGridSkeleton count={6} />;
  }

  if (!courses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-10 w-10 text-muted-foreground"
          >
            <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
            <path d="M16.5 9.4 7.55 4.24" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" y1="22" x2="12" y2="12" />
            <circle cx="18.5" cy="15.5" r="2.5" />
            <path d="M20.27 17.27 22 19" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">{emptyMessage}</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Try adjusting your search or filter criteria to find the courses you're looking for.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className || ''}`}
    >
      {courses.map((course) => (
        <motion.div key={course.id} variants={fadeIn}>
          <CourseCard
            id={course.id}
            title={course.title}
            description={course.description}
            thumbnailUrl={course.thumbnailUrl || ""}
            category={course.category}
            level={course.level}
            duration={course.duration}
            isBookmarked={bookmarkedCourses.includes(course.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
