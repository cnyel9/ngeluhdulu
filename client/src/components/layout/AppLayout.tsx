import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Moon, Sun, Home, History, BarChart2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore, staggerContainer } from '@/lib/theme-store';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggleTheme } = useThemeStore();
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Curhat', icon: Home },
    { href: '/riwayat', label: 'Riwayat', icon: History },
    { href: '/grafik', label: 'Grafik', icon: BarChart2 },
    { href: '/tentang', label: 'Tentang', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12">
      {/* Navbar */}
      <header className="sticky top-0 z-10 backdrop-blur-lg border-b border-border/40 bg-background/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="rounded-full bg-primary/20 p-2">
                  <span className="block text-xl">😤</span>
                </span>
                <span className="hidden sm:inline">Ngeluh Dulu, Baru Tenang</span>
              </div>
            </Link>
          </div>
          
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.div>
      </main>
      
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/40 z-10">
        <div className="container mx-auto flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-colors cursor-pointer",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}