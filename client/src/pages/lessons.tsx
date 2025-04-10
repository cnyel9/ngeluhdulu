import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckIcon, ChevronRight, CopyIcon, FileText, Lightbulb, Trophy } from "lucide-react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

type Module = {
  id: number;
  languageId: number;
  title: string;
  description: string;
  level: string;
  levelNumber: number;
  thumbnailUrl: string | null;
  sortOrder: number;
  pointsToEarn: number;
};

type Lesson = {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  content: string;
  codeExample: string | null;
  previewHtml: string | null;
  sortOrder: number;
};

type LessonProgress = {
  completed: boolean;
  pointsEarned: number;
};

export default function Lessons() {
  const { id } = useParams<{ id: string }>();
  const moduleId = parseInt(id);

  const { data: module, isLoading: isLoadingModule } = useQuery<Module>({
    queryKey: [`/api/modules/${moduleId}`],
  });

  const { data: lessons, isLoading: isLoadingLessons } = useQuery<Lesson[]>({
    queryKey: [`/api/modules/${moduleId}/lessons`],
    enabled: !!moduleId,
  });

  const userProgress = lessons?.map(() => ({ completed: false, pointsEarned: 0 }));
  
  // Calculate overall progress for this module
  const completedLessons = userProgress?.filter(p => p.completed).length || 0;
  const totalLessons = lessons?.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <AppLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/language/${module?.languageId}/modules`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <span>{module?.title || "Pelajaran"}</span>
          </div>
        }
        description={module?.description || "Daftar pelajaran yang tersedia"}
      >
        <Badge variant="outline" className="gap-1 ml-auto">
          <Trophy className="w-3 h-3 text-yellow-500" />
          <span className="text-xs">{module?.pointsToEarn || 0} points</span>
        </Badge>
      </PageHeader>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {isLoadingLessons ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Card key={i} className="h-20 animate-pulse">
              <div className="h-full bg-muted/20"></div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {lessons?.map((lesson, index) => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson}
              index={index + 1}
              isCompleted={userProgress?.[index]?.completed || false}
              isLocked={index > 0 && !userProgress?.[index - 1]?.completed}
            />
          ))}
        </motion.div>
      )}
    </AppLayout>
  );
}

function LessonCard({ lesson, index, isCompleted, isLocked }: { 
  lesson: Lesson;
  index: number;
  isCompleted: boolean;
  isLocked: boolean;
}) {
  return (
    <motion.div variants={slideUp}>
      <Card className={cn(
        "overflow-hidden border-border/50 backdrop-blur-md transition-colors",
        !isLocked && "hover:border-primary/50 cursor-pointer group"
      )}>
        <div className="flex items-center h-full">
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full m-4",
            isCompleted ? "bg-green-500/20 text-green-500" : 
            isLocked ? "bg-muted/20 text-muted-foreground" : "bg-primary/20 text-primary"
          )}>
            {isCompleted ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <span className="font-bold">{index}</span>
            )}
          </div>
          <div className="flex-1 py-4 mr-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{lesson.title}</h3>
              
              {isLocked ? (
                <Badge variant="outline" className="gap-1">
                  <CopyIcon className="w-3 h-3" />
                  <span>Terkunci</span>
                </Badge>
              ) : isCompleted ? (
                <Badge variant="success" className="gap-1">
                  <CheckIcon className="w-3 h-3" />
                  <span>Selesai</span>
                </Badge>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Pelajaran</span>
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Lightbulb className="w-3 h-3" />
                    <span>1 Tantangan</span>
                  </Badge>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
          </div>
          {!isLocked && (
            <div className="pr-4">
              <Link href={`/lesson/${lesson.id}`}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}