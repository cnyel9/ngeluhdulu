import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current viewport is mobile size
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set to true if viewport width is less than or equal to 768px (tailwind md breakpoint)
      setIsMobile(window.innerWidth <= 768);
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isMobile;
}