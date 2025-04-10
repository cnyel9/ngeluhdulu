import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Code, CodepenIcon, FileCode, Flame, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/theme";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { UserProfile, useUserProfile } from "@/App";

type Language = {
  id: number;
  name: string;
  displayName: string;
  description: string;
  iconUrl: string | null;
  color: string;
};

export default function Dashboard() {
  const { userProfile } = useUserProfile();
  const { data: languages, isLoading } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
  });

  return (
    <AppLayout>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PageHeader
            title={
              userProfile ? `Halo, ${userProfile.displayName || userProfile.username}!` : "Selamat Datang di Malas Ngoding"
            }
            description="Belajar coding menjadi lebih mudah dan menyenangkan"
          />
        </motion.div>

        <motion.div 
          className="mt-8 grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <StatCard 
            title="HTML" 
            value={`Level ${userProfile?.htmlLevel || 1}`} 
            icon={<FileCode className="h-5 w-5 text-orange-500" />}
            color="bg-orange-500/10"
          />
          <StatCard 
            title="CSS" 
            value={`Level ${userProfile?.cssLevel || 1}`} 
            icon={<CodepenIcon className="h-5 w-5 text-blue-500" />}
            color="bg-blue-500/10"
          />
          <StatCard 
            title="JavaScript" 
            value={`Level ${userProfile?.jsLevel || 1}`} 
            icon={<Code className="h-5 w-5 text-yellow-500" />}
            color="bg-yellow-500/10"
          />
        </motion.div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Progres Belajar</h2>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-xs">Hari ke-1</span>
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Award className="w-3 h-3 text-yellow-500" />
              <span className="text-xs">{userProfile?.totalPoints || 0} Poin</span>
            </Badge>
          </div>
        </div>

        {userProfile ? (
          <Card className="border-border/50 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="space-y-5">
                <ProgressItem 
                  label="HTML" 
                  progress={calculateLevelProgress(userProfile.htmlLevel)} 
                  color="from-orange-600 to-red-600" 
                />
                <ProgressItem 
                  label="CSS" 
                  progress={calculateLevelProgress(userProfile.cssLevel)} 
                  color="from-blue-600 to-indigo-600" 
                />
                <ProgressItem 
                  label="JavaScript" 
                  progress={calculateLevelProgress(userProfile.jsLevel)} 
                  color="from-yellow-500 to-amber-600" 
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50 backdrop-blur-md">
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground mb-4">Login untuk menyimpan progres belajarmu</p>
              <div className="flex gap-4 justify-center">
                <Button asChild variant="default">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mulai Belajar</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/languages">Lihat Semua</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="h-64 animate-pulse">
                <div className="h-full bg-muted/20"></div>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {languages?.map((language) => (
              <LanguageCardSimple key={language.id} language={language} />
            ))}
          </motion.div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Fitur Keren</h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <FeatureCard 
            title="Kumpulkan Lencana" 
            description="Dapatkan lencana setiap menyelesaikan misi dan pembelajaran" 
            icon={<Award className="h-8 w-8 text-yellow-500" />}
            linkText="Lihat Lencana"
            linkHref="/badges"
          />
          <FeatureCard 
            title="Tantangan Interaktif" 
            description="Latih kemampuanmu dengan tantangan pemrograman yang menarik" 
            icon={<Lightbulb className="h-8 w-8 text-orange-500" />}
            linkText="Mulai Tantangan"
            linkHref="/languages"
          />
        </motion.div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2023 Malas Ngoding. Dibuat oleh <a href="https://instagram.com/y2el.nine" target="_blank" className="text-primary hover:underline">Levi Setiadi</a></p>
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, icon, color }: { 
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div variants={fadeIn}>
      <Card className="border-border/50 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className={cn("p-2 rounded-full", color)}>
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground leading-none mb-1">
                  {title}
                </p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProgressItem({ label, progress, color }: {
  label: string;
  progress: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function LanguageCardSimple({ language }: { language: Language }) {
  let LanguageIcon;
  switch (language.name) {
    case 'html':
      LanguageIcon = FileCode;
      break;
    case 'css':
      LanguageIcon = CodepenIcon;
      break;
    case 'javascript':
      LanguageIcon = Code;
      break;
    default:
      LanguageIcon = Code;
  }

  return (
    <motion.div variants={fadeIn}>
      <Link href={`/language/${language.id}/modules`}>
        <Card className="h-full overflow-hidden border-border/50 backdrop-blur-md hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader className="pb-2" style={{ backgroundColor: `${language.color}20` }}>
            <div className="flex justify-between items-center">
              <Badge variant="secondary" style={{ backgroundColor: language.color, color: '#fff' }} className="font-medium text-xs">
                {language.displayName}
              </Badge>
              <LanguageIcon className="w-6 h-6" style={{ color: language.color }} />
            </div>
            <CardTitle className="text-xl mt-2">{language.displayName}</CardTitle>
            <CardDescription className="line-clamp-2">{language.description}</CardDescription>
          </CardHeader>
          <CardFooter className="pt-3">
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto group-hover:bg-primary group-hover:text-primary-foreground"
            >
              Mulai Belajar
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

function FeatureCard({ title, description, icon, linkText, linkHref }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
}) {
  return (
    <motion.div variants={fadeIn}>
      <Card className="border-border/50 backdrop-blur-md hover:border-primary/50 transition-colors group">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              {icon}
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <Button asChild variant="ghost" className="ml-auto group-hover:text-primary">
            <Link href={linkHref}>{linkText}</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Helper function to calculate level progress (for demo purposes)
function calculateLevelProgress(level: number): number {
  // This is just a placeholder. In a real app, you would calculate this based on actual progress
  switch (level) {
    case 1:
      return 30;
    case 2:
      return 60;
    case 3:
      return 90;
    default:
      return 0;
  }
}