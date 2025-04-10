import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { PageLoader, ContentLoading } from "@/components/shared/loading-state";
import { ContentPlayer } from "@/components/course/content-player";
import { ProgressTracker } from "@/components/course/progress-tracker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { staggerContainer, fadeIn, slideUp } from "@/lib/theme";
import { BookmarkPlus, BookmarkIcon, Clock, Award, BarChart } from "lucide-react";

export default function CourseDetails() {
  const [match, params] = useRoute("/course/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const courseId = match ? parseInt(params.id) : 0;
  
  const [activeContentId, setActiveContentId] = useState<number | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  
  // Fetch course details
  const { data: courseData, isLoading: isLoadingCourse } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });
  
  // Fetch course content
  const { data: contentItems, isLoading: isLoadingContent } = useQuery({
    queryKey: [`/api/courses/${courseId}/content`],
    enabled: !!courseId,
  });
  
  // Fetch user progress
  const { data: progressData, isLoading: isLoadingProgress } = useQuery({
    queryKey: [`/api/courses/${courseId}/progress`],
    enabled: !!courseId,
  });
  
  // Bookmark mutation
  const { mutate: toggleBookmark, isPending: isBookmarking } = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        await apiRequest("DELETE", `/api/courses/${courseId}/bookmark`);
      } else {
        await apiRequest("POST", `/api/courses/${courseId}/bookmark`);
      }
    },
    onSuccess: () => {
      // Update bookmarks in cache
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      
      toast({
        title: isBookmarked ? "Bookmark removed" : "Bookmarked!",
        description: isBookmarked 
          ? "Course removed from your bookmarks" 
          : "Course added to your bookmarks",
      });
      
      setIsBookmarked(!isBookmarked);
    },
    onError: (error) => {
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  });
  
  // Format content items into modules
  const [modules, setModules] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Set initial active content
  useEffect(() => {
    if (contentItems?.length && !activeContentId) {
      // Find first incomplete content or first content
      const incompleteContent = contentItems.find(
        (item: any) => progressData?.find((p: any) => p.contentItemId === item.id)?.completed === false
      );
      
      setActiveContentId(incompleteContent?.id || contentItems[0]?.id || null);
    }
  }, [contentItems, progressData, activeContentId]);
  
  // Process content items into modules
  useEffect(() => {
    if (!contentItems) return;
    
    // Group content items by "sort_order" into modules (1.x, 2.x, etc.)
    const moduleMap = new Map();
    
    contentItems.forEach((item: any) => {
      const moduleNumber = Math.floor(item.sortOrder);
      const moduleKey = `module-${moduleNumber}`;
      
      if (!moduleMap.has(moduleKey)) {
        moduleMap.set(moduleKey, {
          id: moduleNumber,
          title: `Module ${moduleNumber}`,
          contentItems: [],
        });
      }
      
      // Find progress for this item
      const progress = progressData?.find((p: any) => p.contentItemId === item.id);
      
      moduleMap.get(moduleKey).contentItems.push({
        id: item.id,
        title: item.title,
        type: item.type,
        duration: item.duration || 0,
        completed: progress?.completed || false,
        progress: progress?.progress || 0,
        locked: false, // In a real app, this would be based on prerequisites
      });
    });
    
    // Sort modules and content items
    const sortedModules = Array.from(moduleMap.values()).sort((a, b) => a.id - b.id);
    
    // Sort content items within each module
    sortedModules.forEach(module => {
      module.contentItems.sort((a: any, b: any) => {
        const aItemIndex = contentItems.findIndex((item: any) => item.id === a.id);
        const bItemIndex = contentItems.findIndex((item: any) => item.id === b.id);
        return aItemIndex - bItemIndex;
      });
    });
    
    setModules(sortedModules);
  }, [contentItems, progressData]);
  
  // Check if course is already bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const res = await fetch("/api/bookmarks");
        const bookmarks = await res.json();
        
        const isBookmarked = bookmarks.some((bookmark: any) => bookmark.courseId === courseId);
        setIsBookmarked(isBookmarked);
      } catch (error) {
        console.error("Failed to check bookmark status:", error);
      }
    };
    
    if (courseId) {
      checkBookmarkStatus();
    }
  }, [courseId]);
  
  // Handle content selection
  const handleSelectContent = (contentId: number) => {
    setActiveContentId(contentId);
  };
  
  // Handle progress update
  const handleProgressUpdate = (progress: number) => {
    setCurrentProgress(progress);
  };
  
  // Find active content
  const activeContent = contentItems?.find((item: any) => item.id === activeContentId);
  
  // Loading states
  if (isLoadingCourse) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }
  
  if (!courseData) {
    return (
      <AppLayout>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col items-center justify-center py-16 text-center">
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The course you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate("/browse-courses")}>
              Browse Courses
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Course Header */}
          <motion.div variants={fadeIn} className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-medium bg-primary/10">
                  {courseData.category}
                </Badge>
                <Badge 
                  className={
                    courseData.level === "beginner" ? "bg-green-500" :
                    courseData.level === "intermediate" ? "bg-blue-500" :
                    "bg-purple-500"
                  }
                >
                  {courseData.level.charAt(0).toUpperCase() + courseData.level.slice(1)}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-3">{courseData.title}</h1>
              
              <p className="text-muted-foreground mb-4">
                {courseData.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    {courseData.duration >= 60 
                      ? `${Math.floor(courseData.duration / 60)}h ${courseData.duration % 60}m` 
                      : `${courseData.duration}m`
                    }
                  </span>
                </div>
                
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{contentItems?.length || 0} Lessons</span>
                </div>
                
                {progressData && progressData.length > 0 && (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {Math.round(
                        (progressData.filter((p: any) => p.completed).length / progressData.length) * 100
                      )}% Complete
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => toggleBookmark()}
                  disabled={isBookmarking}
                  variant={isBookmarked ? "default" : "outline"}
                  className={isBookmarked ? "bg-primary" : ""}
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkIcon className="mr-2 h-4 w-4" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="mr-2 h-4 w-4" />
                      Add to Bookmarks
                    </>
                  )}
                </Button>
                
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=Instructor&background=8b5cf6&color=fff`} />
                    <AvatarFallback>IN</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">Instructor</div>
                    <div className="text-xs text-muted-foreground">Expert Educator</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Course Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area - player */}
            <motion.div variants={slideUp} className="lg:col-span-2">
              {isLoadingContent || !activeContent ? (
                <ContentLoading title="Loading course content" />
              ) : (
                <ContentPlayer
                  contentId={activeContent.id}
                  courseId={courseId}
                  contentUrl={activeContent.content}
                  contentType={activeContent.type}
                  title={activeContent.title}
                  onProgress={handleProgressUpdate}
                />
              )}
              
              {/* Tabs for content details */}
              <Tabs defaultValue="overview" className="mt-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4 bg-card rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-2">{activeContent?.title}</h3>
                  <p className="text-muted-foreground">
                    {activeContent?.type === "video" 
                      ? "Watch this video lesson to learn key concepts and practical techniques. Take your time to understand each topic before moving to the next section."
                      : "Read through this article carefully to understand important concepts and ideas. You can make notes and highlight important sections."}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">What you'll learn</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Understanding core principles and practical implementation</li>
                      <li>Step-by-step guide to problem-solving techniques</li>
                      <li>Hands-on exercises to reinforce your learning</li>
                      <li>Real-world applications and case studies</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="resources" className="p-4 bg-card rounded-lg mt-4">
                  <h3 className="text-lg font-semibold mb-3">Lesson Resources</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-primary mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <div>
                          <div className="font-medium text-sm">Lesson Slides</div>
                          <div className="text-xs text-muted-foreground">PDF • 2.4MB</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                    
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-primary mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <path d="M14 2v6h6"></path>
                          <circle cx="10" cy="13" r="2"></circle>
                          <path d="m20 17-2-2-2 2-2-2-2 2"></path>
                        </svg>
                        <div>
                          <div className="font-medium text-sm">Exercise Files</div>
                          <div className="text-xs text-muted-foreground">ZIP • 1.8MB</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                    
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-primary mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                          <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                        <div>
                          <div className="font-medium text-sm">Cheat Sheet</div>
                          <div className="text-xs text-muted-foreground">PDF • 320KB</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="discussions" className="p-4 bg-card rounded-lg mt-4">
                  <div className="text-center py-6">
                    <div className="rounded-full bg-muted p-4 inline-flex mx-auto mb-4">
                      <svg className="h-6 w-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Join the Discussion</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      Connect with other learners, ask questions, and share your insights about this lesson.
                    </p>
                    <Button>Start a conversation</Button>
                  </div>
                </TabsContent>
                <TabsContent value="notes" className="p-4 bg-card rounded-lg mt-4">
                  <div className="text-center py-6">
                    <div className="rounded-full bg-muted p-4 inline-flex mx-auto mb-4">
                      <svg className="h-6 w-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Take Notes</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      Jot down important points, ideas, and questions as you go through the lesson.
                    </p>
                    <Button>Add a note</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
            
            {/* Sidebar - course progress */}
            <motion.div variants={slideUp}>
              <ProgressTracker
                courseId={courseId}
                modules={modules}
                currentContentId={activeContentId}
                onSelectContent={handleSelectContent}
                className="sticky top-20"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
