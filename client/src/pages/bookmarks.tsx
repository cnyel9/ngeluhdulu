import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { CourseGrid } from "@/components/course/course-grid";
import { PageLoader } from "@/components/shared/loading-state";
import { Bookmark, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/theme";

export default function Bookmarks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch bookmarks
  const { data: bookmarks, isLoading: isLoadingBookmarks } = useQuery({
    queryKey: ["/api/bookmarks"],
  });
  
  // Fetch course details for all bookmarked courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/bookmarks/courses"],
    queryFn: async () => {
      if (!bookmarks?.length) return [];
      
      try {
        // In a real app, we'd have an endpoint to fetch all courses by IDs
        // For now, we'll fetch each course individually
        const coursePromises = bookmarks.map((bookmark: any) => 
          fetch(`/api/courses/${bookmark.courseId}`).then(res => res.json())
        );
        
        return Promise.all(coursePromises);
      } catch (error) {
        console.error("Failed to fetch bookmarked courses:", error);
        return [];
      }
    },
    enabled: !!bookmarks?.length,
  });
  
  // Filter courses based on search query
  const filteredCourses = courses?.filter((course: any) => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Remove bookmark mutation
  const { mutate: removeBookmark } = useMutation({
    mutationFn: async (courseId: number) => {
      return apiRequest("DELETE", `/api/courses/${courseId}/bookmark`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks/courses"] });
      
      toast({
        title: "Bookmark removed",
        description: "The course has been removed from your bookmarks",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove bookmark",
        variant: "destructive",
      });
    },
  });
  
  // Bulk remove bookmarks
  const { mutate: bulkRemoveBookmarks, isPending: isRemoving } = useMutation({
    mutationFn: async () => {
      // In a real app, we'd have a bulk delete endpoint
      // For this example, we'll remove them one by one
      const promises = selectedCourses.map(courseId => 
        apiRequest("DELETE", `/api/courses/${courseId}/bookmark`)
      );
      
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks/courses"] });
      
      toast({
        title: "Bookmarks removed",
        description: `${selectedCourses.length} courses have been removed from your bookmarks`,
      });
      
      setSelectedCourses([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove bookmarks",
        variant: "destructive",
      });
    },
  });
  
  // Toggle course selection
  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };
  
  // Clear all selections
  const clearSelection = () => {
    setSelectedCourses([]);
  };
  
  // Select all courses
  const selectAllCourses = () => {
    setSelectedCourses(filteredCourses?.map((course: any) => course.id) || []);
  };
  
  // Loading state
  if (isLoadingBookmarks || (bookmarks?.length > 0 && isLoadingCourses)) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <PageHeader 
        title="Bookmarks" 
        description="Courses you've saved for later"
      >
        {selectedCourses.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Cancel
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isRemoving}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove {selectedCourses.length} {selectedCourses.length === 1 ? "item" : "items"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove bookmarks</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove {selectedCourses.length} {selectedCourses.length === 1 ? "course" : "courses"} from your bookmarks?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => bulkRemoveBookmarks()}>
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </PageHeader>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {/* Search and actions */}
          <motion.div variants={slideUp} className="mb-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {filteredCourses?.length > 0 && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground"
                  onClick={selectAllCourses}
                >
                  Select all
                </Button>
              </div>
            )}
          </motion.div>
          
          {/* Bookmarked courses */}
          <motion.div variants={fadeIn}>
            {!courses?.length ? (
              <EmptyBookmarks />
            ) : !filteredCourses?.length ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  We couldn't find any bookmarked courses matching your search.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <CourseGrid 
                courses={filteredCourses} 
                bookmarkedCourses={bookmarks?.map((b: any) => b.courseId) || []}
              />
            )}
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

function EmptyBookmarks() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Bookmark className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Save your favorite courses for easy access by bookmarking them.
      </p>
      <Button onClick={() => window.location.href = "/browse-courses"}>
        Browse Courses
      </Button>
    </div>
  );
}
