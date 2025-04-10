import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Award, BookOpen, ChevronRight, Flame, LockIcon } from "lucide-react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/theme";
import { cn } from "@/lib/utils";

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

type Language = {
  id: number;
  name: string;
  displayName: string;
  description: string;
  iconUrl: string | null;
  color: string;
};

export default function Modules() {
  const { id } = useParams<{ id: string }>();
  const languageId = parseInt(id);

  const { data: language, isLoading: isLoadingLanguage } = useQuery<Language>({
    queryKey: [`/api/languages/${languageId}`],
  });

  const { data: modules, isLoading: isLoadingModules } = useQuery<Module[]>({
    queryKey: [`/api/languages/${languageId}/modules`],
    enabled: !!languageId,
  });

  // Get user level for this language from localStorage
  // This would normally come from an API call or user context
  const getUserLevel = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return 1;
    
    try {
      const user = JSON.parse(storedUser);
      if (language?.name === 'html') return user.htmlLevel || 1;
      if (language?.name === 'css') return user.cssLevel || 1;
      if (language?.name === 'javascript') return user.jsLevel || 1;
      return 1;
    } catch (e) {
      return 1;
    }
  };

  const userLevel = getUserLevel();

  return (
    <AppLayout>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/languages">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <span>{language?.displayName || "Modul"}</span>
          </div>
        }
        description="Pilih level pembelajaran yang ingin kamu ikuti"
      >
        <Badge variant="outline" className="gap-1 ml-auto">
          <Flame className="w-3 h-3 text-orange-500" />
          <span className="text-xs">Level {userLevel}</span>
        </Badge>
      </PageHeader>

      {isLoadingModules ? (
        <div className="space-y-6">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="h-32 animate-pulse">
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
          {modules?.map((module) => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              isLocked={module.levelNumber > userLevel}
              languageColor={language?.color || "#666"} 
            />
          ))}
        </motion.div>
      )}
    </AppLayout>
  );
}

function ModuleCard({ module, isLocked, languageColor }: { 
  module: Module;
  isLocked: boolean;
  languageColor: string;
}) {
  return (
    <motion.div variants={slideUp}>
      <Card className={cn(
        "overflow-hidden border-border/50 backdrop-blur-md transition-colors group",
        !isLocked && "hover:border-primary/50 cursor-pointer"
      )}>
        <div className="flex items-stretch h-full">
          <div 
            className="w-2 h-full" 
            style={{ backgroundColor: languageColor }}
          ></div>
          <div className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge 
                  variant={module.level === "easy" ? "default" : 
                          module.level === "medium" ? "secondary" : "destructive"}
                  className="font-medium text-xs"
                >
                  {module.level === "easy" ? "Pemula" : 
                   module.level === "medium" ? "Menengah" : "Mahir"}
                </Badge>
                <Badge variant="outline" className="font-medium gap-1">
                  <Award className="w-3 h-3" />
                  <span>{module.pointsToEarn} Points</span>
                </Badge>
              </div>
              <CardTitle className="text-xl mt-2">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="w-3 h-3" />
                <span>5 Pelajaran</span>
                <Separator orientation="vertical" className="h-3" />
                <Award className="w-3 h-3" />
                <span>2 Tantangan</span>
              </div>
              
              {isLocked ? (
                <Button variant="outline" disabled size="sm" className="gap-1">
                  <LockIcon className="w-3 h-3" />
                  <span>Terkunci</span>
                </Button>
              ) : (
                <Link href={`/module/${module.id}/lessons`}>
                  <Button
                    size="sm"
                    variant="default"
                    className="gap-1 group-hover:bg-primary"
                  >
                    <span>Mulai</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}