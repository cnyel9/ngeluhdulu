import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      
      setTheme: (theme: Theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Initialize theme from storage on app load
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme-storage');
  if (savedTheme) {
    try {
      const parsedState = JSON.parse(savedTheme);
      const theme = parsedState.state.theme;
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (e) {
      console.error('Failed to parse stored theme', e);
    }
  } else {
    // Set default theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }
}

// Animation variants for Framer Motion
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const popIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 260,
      damping: 20 
    } 
  }
};

export const hoverScale = {
  scale: 1.03,
  transition: { duration: 0.2 }
};