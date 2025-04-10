import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { CourseGrid } from "@/components/course/course-grid";
import { CourseFilter, type CourseFilters } from "@/components/course/course-filter";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/loading-state";
import { useLocation } from "wouter";
import { SlidersHorizontal, GridIcon, Columns } from "lucide-react";

export default function BrowseCourses() {
  const [, params] = useLocation();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<CourseFilters>({
    search: "",
    categories: [],
    levels: [],
    duration: [0, 480], // 0 to 8 hours
  });
  
  // Parse search query from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setFilters(prev => ({ ...prev, search: queryParam }));
    }
  }, [params]);
  
  // Fetch all courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses?limit=50");
      return res.json();
    },
  });
  
  // Fetch bookmarks to show bookmark status
  const { data: bookmarks } = useQuery({
    queryKey: ["/api/bookmarks"],
  });
  
  // Filter courses based on current filters
  const filteredCourses = courses?.filter((course: any) => {
    // Filter by search term
    if (
      filters.search &&
      !course.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !course.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by categories
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(course.category)
    ) {
      return false;
    }
    
    // Filter by level
    if (
      filters.levels.length > 0 &&
      !filters.levels.includes(course.level)
    ) {
      return false;
    }
    
    // Filter by duration
    if (
      course.duration < filters.duration[0] ||
      course.duration > filters.duration[1]
    ) {
      return false;
    }
    
    return true;
  });
  
  // Get bookmark IDs for display
  const bookmarkedCourseIds = bookmarks?.map((bookmark: any) => bookmark.courseId) || [];
  
  // Handle filter changes
  const handleFilterChange = (newFilters: CourseFilters) => {
    setFilters(newFilters);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      categories: [],
      levels: [],
      duration: [0, 480],
    });
  };
  
  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  if (isLoadingCourses) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <PageHeader 
        title="Browse Courses" 
        description="Discover our comprehensive library of high-quality courses"
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="md:hidden" 
          onClick={toggleFilters}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </PageHeader>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          {showFilters && (
            <aside className="md:w-64 flex-shrink-0">
              <CourseFilter 
                onFilter={handleFilterChange} 
                onReset={handleResetFilters} 
              />
            </aside>
          )}
          
          {/* Main content */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredCourses?.length || 0} courses
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <GridIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Columns className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CourseGrid 
              courses={filteredCourses || []} 
              isLoading={isLoadingCourses}
              bookmarkedCourses={bookmarkedCourseIds}
              emptyMessage={
                filters.search || filters.categories.length > 0 || filters.levels.length > 0
                  ? "No courses match your filters"
                  : "No courses available"
              }
            />
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
