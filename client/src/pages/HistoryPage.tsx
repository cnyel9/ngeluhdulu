import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Filter } from 'lucide-react';

import { useComplaintStore } from '../store/useComplaintStore';
import { ComplaintList } from '../components/complaints/ComplaintList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { fadeIn, slideUp } from '../lib/theme-store';
import { useTitle } from '../hooks/use-title';
import { Complaint, Feeling } from '../types';

// Emoji mapping for each feeling
const feelingEmojis: Record<Feeling, string> = {
  kesel: '😠',
  sedih: '😢',
  capek: '😫',
  bingung: '😕',
  bete: '😒',
};

// Display name for each feeling
const FEELING_NAMES: Record<Feeling, string> = {
  kesel: 'Kesel',
  sedih: 'Sedih',
  capek: 'Capek',
  bingung: 'Bingung',
  bete: 'Bete',
};

export default function HistoryPage() {
  useTitle('Riwayat Keluhan - Ngeluh Dulu, Baru Tenang');
  
  const { complaints } = useComplaintStore();
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [timeframe, setTimeframe] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [feelingFilter, setFeelingFilter] = useState<'all' | Feeling>('all');
  
  useEffect(() => {
    // First filter by timeframe
    let timeframeFiltered = complaints;
    
    if (timeframe !== 'all') {
      const today = new Date();
      let startDate: Date;
      
      if (timeframe === 'today') {
        startDate = new Date(today.setHours(0, 0, 0, 0));
      } else if (timeframe === 'week') {
        startDate = subDays(today, 7);
      } else {
        startDate = subDays(today, 30);
      }
      
      timeframeFiltered = complaints.filter((complaint) => {
        const complaintDate = new Date(complaint.createdAt);
        return complaintDate >= startDate;
      });
    }
    
    // Then filter by feeling
    if (feelingFilter !== 'all') {
      timeframeFiltered = timeframeFiltered.filter(
        (complaint) => complaint.feeling === feelingFilter
      );
    }
    
    setFilteredComplaints(timeframeFiltered);
  }, [complaints, timeframe, feelingFilter]);
  
  const handleTimeframeChange = (newTimeframe: 'all' | 'today' | 'week' | 'month') => {
    setTimeframe(newTimeframe);
  };
  
  const handleFeelingChange = (newFeeling: 'all' | Feeling) => {
    setFeelingFilter(newFeeling);
  };
  
  const getTimeframeTitle = () => {
    switch (timeframe) {
      case 'today':
        return `Hari Ini (${format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })})`;
      case 'week':
        return '7 Hari Terakhir';
      case 'month':
        return '30 Hari Terakhir';
      default:
        return 'Semua Waktu';
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div variants={fadeIn}>
        <Card className="mb-6 border-border/40 bg-card/80 backdrop-blur-sm shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Riwayat Keluhan</span>
                </CardTitle>
                <CardDescription>
                  Melihat kembali keluhan-keluhanmu yang lalu
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Timeframe filter */}
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Filter Waktu:</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <motion.div variants={slideUp} className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTimeframeChange('all')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    timeframe === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => handleTimeframeChange('today')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    timeframe === 'today'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  Hari Ini
                </button>
                <button
                  onClick={() => handleTimeframeChange('week')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    timeframe === 'week'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  7 Hari
                </button>
                <button
                  onClick={() => handleTimeframeChange('month')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    timeframe === 'month'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  30 Hari
                </button>
              </motion.div>
            </div>
            
            {/* Feeling filter */}
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Filter Emosi:</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <motion.div variants={slideUp} className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFeelingChange('all')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    feelingFilter === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  Semua
                </button>
                {Object.entries(feelingEmojis).map(([feeling, emoji]) => (
                  <button
                    key={feeling}
                    onClick={() => handleFeelingChange(feeling as Feeling)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center gap-1 ${
                      feelingFilter === feeling
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{FEELING_NAMES[feeling as Feeling]}</span>
                  </button>
                ))}
              </motion.div>
            </div>
            
            <motion.h2 
              variants={slideUp}
              className="text-lg font-medium mb-4"
            >
              {getTimeframeTitle()} 
              <span className="text-muted-foreground ml-2 text-sm font-normal">
                ({filteredComplaints.length} keluhan)
              </span>
            </motion.h2>
            
            <ComplaintList complaints={filteredComplaints} showClearButton />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}