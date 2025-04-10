import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack, 
  SkipForward
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface ContentPlayerProps {
  contentId: number;
  courseId: number;
  contentUrl: string;
  contentType: "video" | "article";
  title: string;
  onProgress?: (progress: number) => void;
  className?: string;
}

export function ContentPlayer({
  contentId,
  courseId,
  contentUrl,
  contentType,
  title,
  onProgress,
  className,
}: ContentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  
  // For article type
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentType === "video" && videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        const progressPercent = (video.currentTime / video.duration) * 100;
        if (onProgress) onProgress(progressPercent);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        // Record completion
        recordProgress(100, video.duration);
      };
      
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("ended", handleEnded);
      
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [contentType, onProgress]);
  
  // Auto-hide controls for video
  useEffect(() => {
    if (contentType !== "video") return;
    
    const handleMouseMove = () => {
      setIsControlsVisible(true);
      setLastInteraction(Date.now());
      
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = window.setTimeout(() => {
        if (isPlaying) {
          setIsControlsVisible(false);
        }
      }, 3000);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, contentType]);
  
  // For article reading progress
  useEffect(() => {
    if (contentType !== "article") return;
    
    const handleScroll = () => {
      if (!articleRef.current) return;
      
      const element = articleRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const scrollPosition = element.scrollTop;
      
      const progress = Math.min(Math.round((scrollPosition / totalHeight) * 100), 100);
      setReadingProgress(progress);
      
      if (onProgress) onProgress(progress);
      
      // If reached end (95% or more), record as complete
      if (progress >= 95) {
        recordProgress(100, 0);
      }
    };
    
    const article = articleRef.current;
    if (article) {
      article.addEventListener("scroll", handleScroll);
      return () => article.removeEventListener("scroll", handleScroll);
    }
  }, [contentType, onProgress]);
  
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      // Record progress when pausing
      const progressPercent = (currentTime / duration) * 100;
      recordProgress(progressPercent, currentTime);
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newTime = value[0];
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newVolume = value[0];
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };
  
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  
  const skipForward = () => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
  };
  
  const skipBackward = () => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Record progress to backend
  const recordProgress = async (progressPercent: number, timeSpent: number) => {
    try {
      await apiRequest("POST", `/api/content/${contentId}/progress`, {
        progress: Math.round(progressPercent),
        completed: progressPercent >= 95,
        timeSpent: Math.round(timeSpent)
      });
    } catch (error) {
      console.error("Failed to record progress:", error);
    }
  };
  
  // Video player component
  if (contentType === "video") {
    return (
      <Card className={cn("overflow-hidden relative group", className)} ref={playerRef}>
        <CardContent className="p-0">
          <div className="aspect-video bg-black">
            <video
              ref={videoRef}
              src={contentUrl}
              className="w-full h-full"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Play/Pause overlay */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                  onClick={togglePlay}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center"
                  >
                    <Play className="h-8 w-8 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Video Controls */}
            <AnimatePresence>
              {isControlsVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white"
                >
                  {/* Progress bar */}
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="mb-3"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={skipBackward}
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={skipForward}
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                      
                      <div className="text-sm ml-2">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 mr-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={toggleMute}
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          min={0}
                          max={1}
                          step={0.1}
                          onValueChange={handleVolumeChange}
                          className="w-24"
                        />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={toggleFullscreen}
                      >
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Article player component
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex flex-col h-full">
          <div className="sticky top-0 z-10 bg-card border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">{title}</h2>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {readingProgress}% complete
              </div>
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600" 
                  style={{ width: `${readingProgress}%` }} 
                />
              </div>
            </div>
          </div>
          
          <div 
            ref={articleRef} 
            className="overflow-y-auto px-6 py-4 prose dark:prose-invert max-w-none h-[500px]"
            dangerouslySetInnerHTML={{ __html: contentUrl }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
