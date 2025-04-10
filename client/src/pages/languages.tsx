import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Code, CodepenIcon, FileCode, Flame, Heart } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/theme";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Language = {
  id: number;
  name: string;
  displayName: string;
  description: string;
  iconUrl: string | null;
  color: string;
};

export default function Languages() {
  const { data: languages, isLoading } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
  });

  return (
    <AppLayout>
      <PageHeader
        title="Malas Ngoding"
        description="Pilih bahasa pemrograman yang ingin kamu pelajari"
      >
        <Badge variant="outline" className="gap-1 ml-auto">
          <Flame className="w-3 h-3 text-orange-500" />
          <span className="text-xs">Hari ke-1</span>
        </Badge>
      </PageHeader>

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
            <LanguageCard key={language.id} language={language} />
          ))}
        </motion.div>
      )}
    </AppLayout>
  );
}

function LanguageCard({ language }: { language: Language }) {
  const LanguageIcon = getLanguageIcon(language.name);
  
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
            <CardDescription>{language.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-4 pt-4">
            <p className="text-sm">
              {language.name === 'html' ? 'Membuat struktur halaman web' : 
              language.name === 'css' ? 'Mendesain tampilan web yang menarik' : 
              'Membuat website interaktif'}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>3 Level</span>
              <Separator orientation="vertical" className="h-3" />
              <Heart className="w-3 h-3 text-red-500" />
              <span>120 Points</span>
            </div>
            
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

function getLanguageIcon(name: string) {
  switch (name) {
    case 'html':
      return FileCode;
    case 'css':
      return CodepenIcon;
    case 'javascript':
      return Code;
    default:
      return Code;
  }
}