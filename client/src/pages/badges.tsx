import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BadgeIcon, Code, LockIcon, Rocket, Star } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Badge = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  requiredPoints: number;
  level: string;
};

export default function Badges() {
  const { data: badges, isLoading } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
  });

  // Get user total points from localStorage to determine unlocked badges
  const getUserTotalPoints = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return 0;
    
    try {
      const user = JSON.parse(storedUser);
      return user.totalPoints || 0;
    } catch (e) {
      return 0;
    }
  };

  const userTotalPoints = getUserTotalPoints();

  // Group badges by category
  const htmlBadges = badges?.filter(badge => badge.category === 'html') || [];
  const cssBadges = badges?.filter(badge => badge.category === 'css') || [];
  const jsBadges = badges?.filter(badge => badge.category === 'javascript') || [];
  const generalBadges = badges?.filter(badge => badge.category === 'general') || [];

  return (
    <AppLayout>
      <PageHeader
        title="Lencana Prestasi"
        description="Kumpulkan lencana dengan menyelesaikan misi dan tantangan"
      >
        <Badge variant="outline" className="gap-1 ml-auto">
          <Star className="w-3 h-3 text-yellow-500" />
          <span className="text-xs">{userTotalPoints} Poin</span>
        </Badge>
      </PageHeader>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <BadgeIcon className="w-4 h-4" />
            <span>Semua</span>
          </TabsTrigger>
          <TabsTrigger value="html" className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            <span>HTML</span>
          </TabsTrigger>
          <TabsTrigger value="css" className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            <span>CSS</span>
          </TabsTrigger>
          <TabsTrigger value="js" className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            <span>JavaScript</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Rocket className="w-4 h-4" />
            <span>Umum</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <BadgeGrid badges={badges || []} userPoints={userTotalPoints} />
        </TabsContent>
        
        <TabsContent value="html">
          <BadgeGrid badges={htmlBadges} userPoints={userTotalPoints} />
        </TabsContent>
        
        <TabsContent value="css">
          <BadgeGrid badges={cssBadges} userPoints={userTotalPoints} />
        </TabsContent>
        
        <TabsContent value="js">
          <BadgeGrid badges={jsBadges} userPoints={userTotalPoints} />
        </TabsContent>
        
        <TabsContent value="general">
          <BadgeGrid badges={generalBadges} userPoints={userTotalPoints} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function BadgeGrid({ badges, userPoints }: { badges: Badge[], userPoints: number }) {
  if (badges.length === 0) {
    return (
      <Card className="border-border/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Tidak Ada Lencana</CardTitle>
          <CardDescription>
            Belum ada lencana dalam kategori ini.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {badges.map((badge) => (
        <BadgeCard 
          key={badge.id} 
          badge={badge} 
          isUnlocked={userPoints >= badge.requiredPoints} 
        />
      ))}
    </motion.div>
  );
}

function BadgeCard({ badge, isUnlocked }: { 
  badge: Badge;
  isUnlocked: boolean;
}) {
  return (
    <motion.div variants={fadeIn}>
      <Card className={cn(
        "h-full overflow-hidden border-border/50 backdrop-blur-md transition-colors",
        isUnlocked ? "hover:border-primary/50" : "opacity-70"
      )}>
        <CardHeader className="text-center relative">
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-2">
                <LockIcon className="h-10 w-10 text-muted-foreground" />
                <p className="font-medium">
                  Butuh {badge.requiredPoints} poin
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-center mb-4">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              {
                'bg-orange-500/20': badge.category === 'html',
                'bg-blue-500/20': badge.category === 'css',
                'bg-yellow-500/20': badge.category === 'javascript',
                'bg-purple-500/20': badge.category === 'general',
              }
            )}>
              <Award className={cn(
                "w-10 h-10",
                {
                  'text-orange-500': badge.category === 'html',
                  'text-blue-500': badge.category === 'css',
                  'text-yellow-500': badge.category === 'javascript',
                  'text-purple-500': badge.category === 'general',
                }
              )} />
            </div>
          </div>
          
          <Badge variant="outline" className="mx-auto mb-2">
            {badge.level === 'beginner' && 'Pemula'}
            {badge.level === 'intermediate' && 'Menengah'}
            {badge.level === 'advanced' && 'Mahir'}
          </Badge>
          
          <CardTitle className="text-xl">{badge.title}</CardTitle>
          <CardDescription>{badge.description}</CardDescription>
        </CardHeader>
        <CardFooter className="text-center justify-center pt-0 pb-4">
          <Badge variant="outline" className="gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>{badge.requiredPoints} Poin</span>
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  );
}