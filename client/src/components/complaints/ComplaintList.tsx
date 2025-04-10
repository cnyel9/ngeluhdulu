import { motion } from 'framer-motion';
import { Frown } from 'lucide-react';
import { Complaint } from '@/types';
import { ComplaintCard } from './ComplaintCard';
import { Button } from '@/components/ui/button';
import { useComplaintStore } from '@/store/useComplaintStore';
import { useToast } from '@/hooks/use-toast';
import { staggerContainer, slideUp } from '@/lib/theme-store';

interface ComplaintListProps {
  complaints: Complaint[];
  showClearButton?: boolean;
}

export function ComplaintList({ complaints, showClearButton = false }: ComplaintListProps) {
  const { deleteAllComplaints } = useComplaintStore();
  const { toast } = useToast();
  
  const handleClearAll = () => {
    if (window.confirm('Yakin mau hapus semua keluhan?')) {
      deleteAllComplaints();
      toast({
        title: 'Semua keluhan dihapus',
        description: 'Mulai dengan lembar baru!',
      });
    }
  };
  
  // If no complaints, show empty state
  if (complaints.length === 0) {
    return (
      <motion.div 
        variants={slideUp}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <Frown className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Belum Ada Keluhan</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Kamu belum menambahkan keluhan apapun. Silakan kembali ke halaman utama untuk ngeluh.
        </p>
        <Button asChild>
          <a href="/">Yuk Ngeluh</a>
        </Button>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-4">
      {showClearButton && complaints.length > 0 && (
        <motion.div 
          variants={slideUp}
          className="flex justify-end mb-4"
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearAll}
            className="text-muted-foreground hover:text-destructive"
          >
            Hapus Semua
          </Button>
        </motion.div>
      )}
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4"
      >
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </motion.div>
    </div>
  );
}