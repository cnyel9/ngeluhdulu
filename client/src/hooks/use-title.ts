import { useEffect } from 'react';

/**
 * Hook to set document title
 */
export function useTitle(title: string) {
  useEffect(() => {
    // Update the document title
    document.title = title;
    
    // Restore the original title when unmounting
    return () => {
      document.title = 'Ngeluh Dulu, Baru Tenang';
    };
  }, [title]);
}