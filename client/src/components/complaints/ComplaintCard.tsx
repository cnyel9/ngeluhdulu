import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { Complaint, Feeling } from '@/types';
import { useComplaintStore } from '@/store/useComplaintStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { popIn, hoverScale } from '@/lib/theme-store';

// Emoji mapping for each feeling
const feelingEmojis: Record<Feeling, string> = {
  kesel: '😠',
  sedih: '😢',
  capek: '😫',
  bingung: '😕',
  bete: '😒',
};

// Background color based on feeling (subtle pastel colors)
const feelingColors: Record<Feeling, string> = {
  kesel: 'bg-red-500/10 border-red-500/30',
  sedih: 'bg-blue-500/10 border-blue-500/30',
  capek: 'bg-orange-500/10 border-orange-500/30',
  bingung: 'bg-purple-500/10 border-purple-500/30',
  bete: 'bg-gray-500/10 border-gray-500/30',
};

interface ComplaintCardProps {
  complaint: Complaint;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const { deleteComplaint } = useComplaintStore();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = () => {
    setIsDeleting(true);
    
    // Add small delay for animation
    setTimeout(() => {
      deleteComplaint(complaint.id);
      toast({
        title: 'Keluhan dihapus',
        description: 'Semoga harimu lebih baik sekarang 😊',
      });
    }, 300);
  };
  
  // Format the date
  const formattedDate = format(new Date(complaint.createdAt), 'EEEE, d MMMM yyyy • HH:mm', { locale: id });
  
  return (
    <motion.div 
      variants={popIn}
      animate={isDeleting ? { scale: 0, opacity: 0 } : {}}
      whileHover={hoverScale}
      layout
    >
      <Card className={`backdrop-blur-sm border ${feelingColors[complaint.feeling]} shadow-md`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label={complaint.feeling}>
                {feelingEmojis[complaint.feeling]}
              </span>
              <span className="capitalize text-sm font-medium">
                {complaint.feeling}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
          
          <p className="text-base whitespace-pre-wrap">{complaint.text}</p>
        </CardContent>
        
        <CardFooter className="flex justify-end pb-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-destructive" 
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span>Hapus</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}