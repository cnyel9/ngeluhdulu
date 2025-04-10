import { useState, useRef } from 'react';
import { Camera, Copy, Download, Share2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Complaint, Feeling } from '../../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import html2canvas from 'html2canvas';

interface ComplaintShareProps {
  complaint: Complaint;
  onClose: () => void;
}

// Emoji mapping for each feeling
const feelingEmojis: Record<Feeling, string> = {
  kesel: '😠',
  sedih: '😢',
  capek: '😫',
  bingung: '😕',
  bete: '😒',
};

// Display name for each feeling
const feelingNames: Record<Feeling, string> = {
  kesel: 'Kesel',
  sedih: 'Sedih',
  capek: 'Capek',
  bingung: 'Bingung',
  bete: 'Bete',
};

// Background colors for different feelings
const feelingColors: Record<Feeling, string> = {
  kesel: 'bg-red-50 dark:bg-red-950',
  sedih: 'bg-blue-50 dark:bg-blue-950',
  capek: 'bg-orange-50 dark:bg-orange-950',
  bingung: 'bg-purple-50 dark:bg-purple-950',
  bete: 'bg-gray-50 dark:bg-gray-950',
};

// Text colors for different feelings
const feelingTextColors: Record<Feeling, string> = {
  kesel: 'text-red-600 dark:text-red-400',
  sedih: 'text-blue-600 dark:text-blue-400',
  capek: 'text-orange-600 dark:text-orange-400',
  bingung: 'text-purple-600 dark:text-purple-400',
  bete: 'text-gray-600 dark:text-gray-400',
};

export function ComplaintShare({ complaint, onClose }: ComplaintShareProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Format date for display
  const formattedDate = format(new Date(complaint.createdAt), "dd MMMM yyyy, HH:mm", { locale: id });
  
  // Generate image from the card
  const generateImage = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      
      const url = canvas.toDataURL('image/png');
      setImageUrl(url);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Download generated image
  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `keluhan-${new Date().getTime()}.png`;
    link.click();
  };
  
  // Copy image to clipboard
  const copyImage = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      
      alert('Gambar berhasil disalin ke clipboard!');
    } catch (error) {
      console.error('Failed to copy image:', error);
      alert('Gagal menyalin gambar.');
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-lg shadow-xl w-full max-w-md border border-border"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-medium">Bagikan Keluhan</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-5">
            {!imageUrl ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Buat gambar dari keluhan kamu untuk dibagikan tanpa identitas.
                </p>
                
                <div 
                  ref={cardRef}
                  className={`p-6 rounded-lg border border-border mb-4 ${feelingColors[complaint.feeling]}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{feelingEmojis[complaint.feeling]}</span>
                    <span className={`font-medium ${feelingTextColors[complaint.feeling]}`}>
                      {feelingNames[complaint.feeling]}
                    </span>
                  </div>
                  
                  <p className="text-foreground font-medium mb-4 text-lg">
                    "{complaint.text}"
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-muted-foreground">
                      {formattedDate}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      via Ngeluh Dulu, Baru Tenang
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={generateImage} 
                  disabled={isGenerating}
                  className="w-full" 
                  variant="default"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Camera className="h-4 w-4 animate-pulse" />
                      <span>Generating...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>Generate Gambar</span>
                    </span>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="bg-muted p-1 rounded-lg mb-4">
                  <img 
                    src={imageUrl} 
                    alt="Keluhan" 
                    className="w-full h-auto rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={downloadImage} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                  
                  <Button 
                    onClick={copyImage} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </Button>
                  
                  <Button 
                    onClick={generateImage} 
                    className="flex items-center gap-2 col-span-2" 
                    variant="default"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Buat Ulang</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}