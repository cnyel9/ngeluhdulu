import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckIcon, ChevronRight, Lightbulb, Rocket } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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

export default function LessonDetails() {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("learn");

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${lessonId}`],
  });

  const { data: challenges, isLoading: isLoadingChallenges } = useQuery<any[]>({
    queryKey: [`/api/lessons/${lessonId}/challenges`],
    enabled: !!lessonId,
  });

  const hasChallenges = !!challenges?.length;

  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/progress`, {
        method: "POST",
        body: JSON.stringify({
          lessonId,
          moduleId: lesson?.moduleId,
          completed: true,
          pointsEarned: 5, // Default points for completing a lesson
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Pelajaran selesai!",
        description: "Kamu mendapatkan 5 poin dari pelajaran ini.",
      });
      
      if (hasChallenges) {
        setActiveTab("challenges");
      } else if (lesson) {
        navigate(`/module/${lesson.moduleId}/lessons`);
      }
    },
  });

  const handleCompleteLesson = () => {
    completeLessonMutation.mutate();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-3/4 bg-muted rounded"></div>
          <div className="h-6 w-1/2 bg-muted rounded"></div>
          <div className="h-[400px] bg-muted rounded"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/module/${lesson?.moduleId}/lessons`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <span>{lesson?.title || "Pelajaran"}</span>
          </div>
        }
        description={lesson?.description || ""}
      />

      <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="learn" className="flex items-center gap-1">
            <Rocket className="w-4 h-4" />
            <span>Materi</span>
          </TabsTrigger>
          <TabsTrigger 
            value="challenges" 
            className="flex items-center gap-1"
            disabled={!hasChallenges}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Tantangan</span>
            {hasChallenges && (
              <Badge variant="outline" className="ml-1 h-5 px-1">
                {challenges?.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="space-y-6">
          {/* Lesson content */}
          <Card className="border-border/50 backdrop-blur-md">
            <CardContent className="pt-6">
              <div 
                className="prose prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: lesson?.content || "" }}
              />
            </CardContent>
          </Card>

          {/* Code example if available */}
          {lesson?.codeExample && (
            <Card className="border-border/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg">Contoh Kode</CardTitle>
                <CardDescription>
                  Pelajari dengan memahami contoh kode di bawah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                  <code>{lesson.codeExample}</code>
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Preview if available (for HTML lessons) */}
          {lesson?.previewHtml && (
            <Card className="border-border/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg">Hasil</CardTitle>
                <CardDescription>
                  Inilah tampilan hasil kode HTML di atas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-white text-black rounded-md min-h-[200px]">
                  <div dangerouslySetInnerHTML={{ __html: lesson.previewHtml }} />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button
              className="gap-2"
              size="lg" 
              onClick={handleCompleteLesson}
              disabled={completeLessonMutation.isPending}
            >
              {completeLessonMutation.isPending ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 rounded-full border-t-transparent"></div>
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
              Selesai Belajar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="space-y-6">
            {hasChallenges ? (
              <>
                <p className="text-lg">Sekarang saatnya menguji pemahamanmu!</p>
                
                <div className="space-y-4">
                  {challenges?.map((challenge, index) => (
                    <Card key={challenge.id} className="border-border/50 backdrop-blur-md hover:border-primary/50 transition-colors">
                      <Link href={`/challenge/${challenge.id}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <Badge variant="outline">Tantangan {index + 1}</Badge>
                            <Badge variant="outline" className="gap-1">
                              <Lightbulb className="w-3 h-3 text-yellow-400" />
                              <span>{challenge.points} points</span>
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mt-2">{challenge.title}</CardTitle>
                          <CardDescription>{challenge.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <Button variant="ghost" className="ml-auto gap-1 group-hover:text-primary">
                            <span>Mulai Tantangan</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Link>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="border-border/50 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Belum Ada Tantangan</CardTitle>
                  <CardDescription>
                    Tidak ada tantangan untuk pelajaran ini. Lanjutkan ke pelajaran berikutnya.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link href={`/module/${lesson?.moduleId}/lessons`}>
                      Kembali ke Pelajaran
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}