import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Flame, Home, Award, BookOpen, Terminal, Code, FileCode, CodepenIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile, useUserProfile } from "@/App";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { userProfile } = useUserProfile();
  
  return (
    <div className={cn(
      "fixed h-screen w-64 border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-16",
      className
    )}>
      <div className="h-full flex flex-col p-4 space-y-4 overflow-auto">
        <div className="space-y-1">
          <SidebarLink
            href="/"
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            isActive={location === "/"}
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase pl-4">Materi Belajar</p>
          <div className="space-y-1">
            <SidebarLink
              href="/languages"
              icon={<Code className="h-4 w-4" />}
              label="Semua Bahasa"
              isActive={location === "/languages"}
            />
            
            <Separator className="my-2" />
            
            <SidebarLink
              href="/language/1/modules"
              icon={<FileCode className="h-4 w-4 text-orange-500" />}
              label="HTML"
              isActive={location.includes("/language/1/")}
              badge={
                <Badge variant="outline" className="ml-auto">
                  Lv {userProfile?.htmlLevel || 1}
                </Badge>
              }
            />
            
            <SidebarLink
              href="/language/2/modules"
              icon={<CodepenIcon className="h-4 w-4 text-blue-500" />}
              label="CSS"
              isActive={location.includes("/language/2/")}
              badge={
                <Badge variant="outline" className="ml-auto">
                  Lv {userProfile?.cssLevel || 1}
                </Badge>
              }
            />
            
            <SidebarLink
              href="/language/3/modules"
              icon={<Terminal className="h-4 w-4 text-yellow-500" />}
              label="JavaScript"
              isActive={location.includes("/language/3/")}
              badge={
                <Badge variant="outline" className="ml-auto">
                  Lv {userProfile?.jsLevel || 1}
                </Badge>
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase pl-4">Lainnya</p>
          <div className="space-y-1">
            <SidebarLink
              href="/badges"
              icon={<Award className="h-4 w-4 text-yellow-500" />}
              label="Lencana"
              isActive={location === "/badges"}
            />
          </div>
        </div>
        
        <div className="mt-auto pt-4">
          {userProfile ? (
            <div className="rounded-md bg-primary/5 p-3">
              <div className="flex gap-2 items-center">
                <Flame className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Poin</p>
                  <p className="text-2xl font-bold">{userProfile.totalPoints}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-muted p-3 text-center">
              <p className="text-sm text-muted-foreground mb-2">Login untuk menyimpan progres</p>
              <Link href="/login">
                <Button size="sm" variant="default" className="w-full">Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: React.ReactNode;
}

function SidebarLink({ href, icon, label, isActive, badge }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start",
          isActive ? "bg-primary/10 hover:bg-primary/20" : ""
        )}
      >
        <span className="mr-2">{icon}</span>
        <span>{label}</span>
        {badge}
      </Button>
    </Link>
  );
}