import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronRight, Lightbulb, Timer } from "lucide-react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/theme";

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

type Challenge = {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  instructions: string;
  initialCode: string | null;
  expectedOutput: string | null;
  hints: string[] | null;
  sortOrder: number;
  points: number;
};

export default function Challenges() {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id);

  const { data: lesson, isLoading: isLoadingLesson } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${lessonId}`],
  });

  const { data: challenges, isLoading: isLoadingChallenges } = useQuery<Challenge[]>({
    queryKey: [`/api/lessons/${lessonId}/challenges`],
    enabled: !!lessonId,
  });

  return (
    <AppLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/lesson/${lessonId}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <span>Tantangan: {lesson?.title}</span>
          </div>
        }
        description="Selesaikan tantangan untuk menguji pemahamanmu"
      >
        <Badge variant="outline" className="gap-1 ml-auto">
          <Lightbulb className="w-3 h-3 text-yellow-500" />
          <span className="text-xs">
            {challenges?.length || 0} Tantangan
          </span>
        </Badge>
      </PageHeader>

      {isLoadingChallenges ? (
        <div className="space-y-6">
          {Array(2).fill(0).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse">
              <div className="h-full bg-muted/20"></div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {challenges?.length ? (
            challenges.map((challenge, index) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                index={index + 1}
              />
            ))
          ) : (
            <Card className="border-border/50 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Belum Ada Tantangan</CardTitle>
                <CardDescription>
                  Tidak ada tantangan untuk pelajaran ini. Kembali ke pelajaran untuk melanjutkan.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href={`/lesson/${lessonId}`}>
                    Kembali ke Pelajaran
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      )}
    </AppLayout>
  );
}

function ChallengeCard({ challenge, index }: { 
  challenge: Challenge;
  index: number;
}) {
  return (
    <motion.div variants={slideUp}>
      <Card className="overflow-hidden border-border/50 backdrop-blur-md hover:border-primary/50 transition-colors cursor-pointer group">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <Badge>Tantangan {index}</Badge>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Timer className="w-3 h-3" />
                <span>~5 menit</span>
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Lightbulb className="w-3 h-3 text-yellow-400" />
                <span>{challenge.points} points</span>
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl mt-2">{challenge.title}</CardTitle>
          <CardDescription>{challenge.description}</CardDescription>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex-1 flex flex-wrap gap-2">
            {/* Display challenge type badges here if needed */}
          </div>
          
          <Link href={`/challenge/${challenge.id}`}>
            <Button
              variant="default"
              className="ml-auto gap-1 group-hover:bg-primary"
            >
              <span>Mulai Tantangan</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}