import { useState, useRef, useEffect } from 'react';
import { Music, PauseCircle, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { fadeIn } from '../../lib/theme-store';

const RAIN_SOUND_URL = 'https://www.youtube.com/embed/HQwLPhE2zys?autoplay=1&loop=1';
const LOFI_SOUND_URL = 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1';

export function BackgroundSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLIFrameElement | null>(null);
  const [audioType, setAudioType] = useState<'rain' | 'lofi'>('rain');

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        // Pause by removing the iframe
        document.body.removeChild(audioRef.current);
        audioRef.current = null;
      }
    } else {
      // Play by loading the iframe
      if (!audioRef.current) {
        const iframe = document.createElement('iframe');
        iframe.src = audioType === 'rain' ? RAIN_SOUND_URL : LOFI_SOUND_URL;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        audioRef.current = iframe;
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Handle audio type change
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      // Remove existing iframe
      document.body.removeChild(audioRef.current);
      
      // Create new iframe with selected audio
      const iframe = document.createElement('iframe');
      iframe.src = audioType === 'rain' ? RAIN_SOUND_URL : LOFI_SOUND_URL;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      audioRef.current = iframe;
    }
  }, [audioType]);

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (isMuted) {
      setVolume(50);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  // Clean up iframe on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        document.body.removeChild(audioRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      variants={fadeIn}
      className="fixed bottom-20 right-4 z-10"
    >
      <div className="relative">
        <Button
          onClick={() => setShowControls(!showControls)}
          variant="outline"
          size="icon"
          className="rounded-full shadow-md bg-background h-10 w-10"
        >
          <Music className={`h-4 w-4 ${isPlaying ? 'text-primary' : 'text-muted-foreground'}`} />
        </Button>

        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-12 right-0 bg-card shadow-lg rounded-lg border border-border p-3 w-56"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium">Suara Latar</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <PauseCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <Music className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between mb-1">
                <div className="flex gap-2">
                  <span 
                    onClick={() => setAudioType('rain')} 
                    className={`cursor-pointer text-xs px-2 py-1 rounded-md ${audioType === 'rain' ? 'bg-primary/20 text-primary' : 'bg-muted'}`}
                  >
                    Hujan
                  </span>
                  <span 
                    onClick={() => setAudioType('lofi')} 
                    className={`cursor-pointer text-xs px-2 py-1 rounded-md ${audioType === 'lofi' ? 'bg-primary/20 text-primary' : 'bg-muted'}`}
                  >
                    Lo-Fi
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-36"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}