import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { slideUp, staggerContainer } from "@/lib/theme";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ContentModule {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
  locked: boolean;
  type: "video" | "article" | "quiz";
  progress?: number;
}

interface CourseModule {
  id: number;
  title: string;
  contentItems: ContentModule[];
}

interface ProgressTrackerProps {
  courseId: number;
  modules: CourseModule[];
  currentContentId?: number;
  onSelectContent: (contentId: number) => void;
  className?: string;
}

export function ProgressTracker({
  courseId,
  modules,
  currentContentId,
  onSelectContent,
  className,
}: ProgressTrackerProps) {
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const { toast } = useToast();

  // Calculate overall progress
  useEffect(() => {
    const totalItems = modules.reduce((total, module) => total + module.contentItems.length, 0);
    const completedItems = modules.reduce((total, module) => 
      total + module.contentItems.filter(item => item.completed).length, 0);
    
    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    setOverallProgress(progress);
  }, [modules]);

  // Expand the module containing the current content
  useEffect(() => {
    if (!currentContentId) return;
    
    modules.forEach(module => {
      const contentExists = module.contentItems.some(item => item.id === currentContentId);
      if (contentExists && !expandedModules.includes(module.id)) {
        setExpandedModules(prev => [...prev, module.id]);
      }
    });
  }, [currentContentId, modules, expandedModules]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSelectContent = (content: ContentModule) => {
    if (content.locked) {
      toast({
        title: "Content locked",
        description: "Complete previous sections to unlock this content",
        variant: "destructive",
      });
      return;
    }
    
    onSelectContent(content.id);
  };

  const getContentIcon = (content: ContentModule) => {
    if (content.locked) return <LockIcon className="h-4 w-4 text-muted-foreground" />;
    if (content.completed) return <CheckCircle className="h-4 w-4 text-primary" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card className={cn("backdrop-blur-md bg-card border-border/50", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Course Progress</CardTitle>
        <div className="flex items-center mt-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="ml-3 text-sm font-medium">{overallProgress}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {modules.map((module) => (
            <motion.div 
              key={module.id}
              variants={slideUp}
              className="border rounded-lg overflow-hidden"
            >
              <div 
                className={cn(
                  "flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                  expandedModules.includes(module.id) && "border-b"
                )}
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center">
                  <h3 className="font-medium">{module.title}</h3>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-2">
                    {module.contentItems.filter(item => item.completed).length} / {module.contentItems.length}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn(
                      "transition-transform",
                      expandedModules.includes(module.id) ? "rotate-180" : "rotate-0"
                    )}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              
              {expandedModules.includes(module.id) && (
                <div className="p-2">
                  {module.contentItems.map((content) => (
                    <div
                      key={content.id}
                      className={cn(
                        "flex items-center p-2 rounded-md cursor-pointer transition-colors",
                        content.locked ? "opacity-60 cursor-not-allowed" : "hover:bg-muted",
                        currentContentId === content.id && "bg-primary/10"
                      )}
                      onClick={() => handleSelectContent(content)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {getContentIcon(content)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium truncate">{content.title}</h4>
                          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                            {formatDuration(content.duration)}
                          </span>
                        </div>
                        
                        {/* Show progress for videos/articles in progress */}
                        {content.progress && content.progress > 0 && content.progress < 100 && (
                          <div className="mt-1 h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary/60"
                              style={{ width: `${content.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
