import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { fadeIn } from '../../lib/theme-store';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Slider } from '../ui/slider';

export function BackgroundAudio() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.youtube.com/embed/HQwLPhE2zys?autoplay=1&loop=1&playlist=HQwLPhE2zys');
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        try {
          audioRef.current.play().catch((e) => console.error("Cannot play audio", e));
        } catch (err) {
          console.error("Error playing audio", err);
        }
      }
      setPlaying(!playing);
    }
  };

  return (
    <motion.div 
      variants={fadeIn}
      className="fixed bottom-20 right-4 z-10"
    >
      <div className="flex flex-col items-end space-y-2">
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-background/80 backdrop-blur-md p-3 rounded-lg shadow-md border border-border/50"
          >
            <div className="mb-2 text-sm font-medium text-center">
              Lo-Fi Music
            </div>
            <div className="w-36">
              <Slider 
                value={[volume * 100]}
                onValueChange={(v) => setVolume(v[0] / 100)}
                min={0}
                max={100}
                step={5}
                className="mb-3"
              />
            </div>
            <div className="flex justify-center">
              <Button 
                variant={playing ? "default" : "outline"} 
                size="sm" 
                onClick={togglePlay}
                className="w-full"
              >
                {playing ? (
                  <span className="flex items-center gap-2">
                    <VolumeX className="h-4 w-4" />
                    <span>Stop</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span>Play</span>
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default" 
                size="icon" 
                className={playing ? "bg-primary shadow-md" : "bg-muted hover:bg-muted/80"} 
                onClick={() => setShowControls(!showControls)}
              >
                <Music className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Lo-Fi Music</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}