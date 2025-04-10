import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
      style={{ 
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : '20px'
      }}
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm h-[320px]">
      <Skeleton height={160} className="w-full" />
      <div className="p-4 space-y-2">
        <Skeleton height={24} />
        <Skeleton height={16} width="60%" />
        <div className="pt-2 flex items-center justify-between">
          <Skeleton height={16} width={80} />
          <Skeleton height={16} width={50} />
        </div>
      </div>
    </div>
  );
}

export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative mb-4">
          <motion.div
            animate={{ 
              rotate: 360,
              transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
            }}
            className="mx-auto"
          >
            <Loader2 className="h-12 w-12 text-primary" />
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ boxShadow: "0 0 0 0px rgba(139, 92, 246, 0.3)" }}
            animate={{ 
              boxShadow: [
                "0 0 0 0px rgba(139, 92, 246, 0.3)",
                "0 0 0 10px rgba(139, 92, 246, 0)",
              ],
              transition: { duration: 1.5, repeat: Infinity }
            }}
          />
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">Loading</h3>
        <p className="text-sm text-muted-foreground">
          Preparing your premium learning experience...
        </p>
      </motion.div>
    </div>
  );
}

interface ContentLoadingProps {
  title?: string;
  subtitle?: string;
}

export function ContentLoading({ title = "Loading content", subtitle = "Please wait while we prepare your content" }: ContentLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-card/50 backdrop-blur-sm">
      <div className="relative mb-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            transition: { duration: 1.5, repeat: Infinity }
          }}
        >
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-pink-500 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        </motion.div>
      </div>
      <h3 className="text-xl font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {subtitle}
      </p>
      <div className="mt-6 w-64 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-pink-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
