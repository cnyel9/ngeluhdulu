import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { CourseGrid } from "@/components/course/course-grid";
import { PageLoader } from "@/components/shared/loading-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/shared/loading-state";
import { motion } from "framer-motion";
import { Search, BookOpen, GraduationCap, Award } from "lucide-react";
import { fadeIn, slideUp } from "@/lib/theme";

export default function MyLearning() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch user's progress across all courses
  const { data: progressData, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/courses/progress"],
    queryFn: async () => {
      // In a real app, this would be an API endpoint that returns all courses with progress
      // For now, we'll simulate this by getting all courses
      const res = await fetch("/api/courses");
      const courses = await res.json();
      
      // Simulate progress data for each course
      return courses.map((course: any) => ({
        ...course,
        progress: Math.floor(Math.random() * 101), // Random progress 0-100%
        lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)), // Random date in last 10 days
      }));
    },
  });
  
  // Filter courses based on search query
  const filteredCourses = progressData?.filter((course: any) => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Separate courses into in-progress and completed
  const inProgressCourses = filteredCourses?.filter((course: any) => 
    course.progress > 0 && course.progress < 100
  ).sort((a: any, b: any) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
  
  const completedCourses = filteredCourses?.filter((course: any) => 
    course.progress === 100
  ).sort((a: any, b: any) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
  
  if (isLoadingProgress) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <PageHeader 
        title="My Learning" 
        description="Track your progress and continue where you left off"
      />
      
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
          {/* Search input */}
          <motion.div className="mb-6" variants={slideUp}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 max-w-md"
              />
            </div>
          </motion.div>
          
          {/* Progress stats */}
          <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg border p-5">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-primary/10 mr-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                  <div className="text-2xl font-semibold mt-1">{inProgressCourses?.length || 0}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-5">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-green-500/10 mr-4">
                  <GraduationCap className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="text-2xl font-semibold mt-1">{completedCourses?.length || 0}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-5">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-amber-500/10 mr-4">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Certificates Earned</div>
                  <div className="text-2xl font-semibold mt-1">{completedCourses?.length || 0}</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Course lists */}
          <motion.div variants={fadeIn}>
            <Tabs defaultValue="in-progress">
              <TabsList>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All Courses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="in-progress" className="pt-6">
                {inProgressCourses?.length > 0 ? (
                  <CourseGrid 
                    courses={inProgressCourses.map((course: any) => ({
                      ...course,
                      progress: course.progress
                    }))} 
                  />
                ) : (
                  <EmptyState 
                    title="No courses in progress" 
                    description="Start learning by enrolling in a course"
                    action={
                      <Button onClick={() => window.location.href = "/browse-courses"}>
                        Browse Courses
                      </Button>
                    }
                  />
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="pt-6">
                {completedCourses?.length > 0 ? (
                  <CourseGrid 
                    courses={completedCourses.map((course: any) => ({
                      ...course,
                      progress: 100
                    }))} 
                  />
                ) : (
                  <EmptyState 
                    title="No completed courses yet" 
                    description="Keep learning to complete your first course"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="all" className="pt-6">
                {filteredCourses?.length > 0 ? (
                  <CourseGrid 
                    courses={filteredCourses.map((course: any) => ({
                      ...course,
                      progress: course.progress
                    }))} 
                  />
                ) : (
                  <EmptyState 
                    title="No courses found" 
                    description="Try adjusting your search or enroll in new courses"
                    action={
                      <Button onClick={() => window.location.href = "/browse-courses"}>
                        Browse Courses
                      </Button>
                    }
                  />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

// Empty state component
function EmptyState({ 
  title, 
  description, 
  action
}: { 
  title: string; 
  description: string; 
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <BookOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}
