import { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/AppLayout';

// Import pages
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ChartPage from './pages/ChartPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  // Add classes to HTML for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <>
      <AppLayout>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/riwayat" component={HistoryPage} />
          <Route path="/grafik" component={ChartPage} />
          <Route path="/tentang" component={AboutPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </AppLayout>
      
      <Toaster />
    </>
  );
}

export default App;