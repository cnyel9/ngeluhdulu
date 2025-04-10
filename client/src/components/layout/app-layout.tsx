import React from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        {showSidebar && !isMobile && <Sidebar className="w-64 hidden md:block" />}
        
        <main className={cn(
          "flex-1 container mx-auto px-4 py-6",
          showSidebar && !isMobile ? "md:ml-64" : ""
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}