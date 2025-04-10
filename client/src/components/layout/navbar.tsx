import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Code, Menu, Star, User, LogOut, Heart, Award, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfile, useUserProfile } from "@/App";

export function Navbar() {
  const isMobile = useIsMobile();
  const { userProfile, setUserProfile } = useUserProfile();
  
  const handleLogout = () => {
    setUserProfile(null);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <motion.div
              className="rounded-full bg-primary p-1"
              initial={{ rotate: -30, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Code className="h-6 w-6 text-white" />
            </motion.div>
            <motion.span 
              className="hidden font-bold sm:inline-block text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Malas Ngoding
            </motion.span>
          </Link>
          
          {!isMobile && (
            <nav className="flex items-center space-x-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/languages">
                      <NavigationMenuLink className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      )}>
                        Belajar
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/badges">
                      <NavigationMenuLink className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      )}>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>Lencana</span>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          )}
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center gap-2">
          {userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile.avatarUrl || ""} alt={userProfile.username} />
                    <AvatarFallback>{userProfile.displayName?.[0] || userProfile.username[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userProfile.displayName || userProfile.username}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{userProfile.totalPoints} poin</span>
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex md:items-center md:gap-2">
              <Link href="/login">
                <Button variant="ghost" className="gap-1">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="default">Daftar</Button>
              </Link>
            </div>
          )}
          
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[385px]">
                <SheetHeader>
                  <SheetTitle>Malas Ngoding</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {!userProfile && (
                    <div className="flex flex-col gap-2">
                      <Link href="/login">
                        <Button className="w-full gap-1 justify-start" variant="ghost">
                          <User className="h-4 w-4" />
                          <span>Login</span>
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full" variant="default">Daftar</Button>
                      </Link>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-muted-foreground font-medium text-xs uppercase pl-4">Menu</p>
                    <div className="space-y-1">
                      <Link href="/">
                        <Button className="w-full justify-start" variant="ghost">
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/languages">
                        <Button className="w-full justify-start" variant="ghost">
                          Belajar
                        </Button>
                      </Link>
                      <Link href="/badges">
                        <Button className="w-full justify-start gap-1" variant="ghost">
                          <Award className="h-4 w-4" />
                          <span>Lencana</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {userProfile && (
                    <div className="space-y-2 mt-4">
                      <p className="text-muted-foreground font-medium text-xs uppercase pl-4">Profil</p>
                      <div className="space-y-1">
                        <Link href="/profile">
                          <Button className="w-full justify-start gap-1" variant="ghost">
                            <User className="h-4 w-4" />
                            <span>Profil</span>
                          </Button>
                        </Link>
                        <Button onClick={handleLogout} className="w-full justify-start gap-1" variant="ghost">
                          <LogOut className="h-4 w-4" />
                          <span>Keluar</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}