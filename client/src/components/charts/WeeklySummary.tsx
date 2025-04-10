import { motion } from 'framer-motion';
import { Calendar, BarChart2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { fadeIn, slideUp } from '../../lib/theme-store';
import { Complaint, Feeling } from '../../types';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';

interface WeeklySummaryProps {
  complaints: Complaint[];
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
const FEELING_NAMES: Record<Feeling, string> = {
  kesel: 'Kesel',
  sedih: 'Sedih',
  capek: 'Capek',
  bingung: 'Bingung',
  bete: 'Bete',
};

export function WeeklySummary({ complaints }: WeeklySummaryProps) {
  // Get complaints from the last 7 days
  const getLastWeekComplaints = () => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6); // 7 days including today
    
    return complaints.filter((complaint) => {
      const complaintDate = new Date(complaint.createdAt);
      return isWithinInterval(complaintDate, {
        start: startOfDay(sevenDaysAgo),
        end: today,
      });
    });
  };
  
  const weeklyComplaints = getLastWeekComplaints();
  const totalWeekly = weeklyComplaints.length;
  
  // Calculate most frequent feeling
  const getMostFrequentFeeling = (): Feeling | null => {
    if (weeklyComplaints.length === 0) return null;
    
    const counts: Record<string, number> = {};
    weeklyComplaints.forEach(complaint => {
      counts[complaint.feeling] = (counts[complaint.feeling] || 0) + 1;
    });
    
    let maxCount = 0;
    let maxFeeling: Feeling | null = null;
    
    Object.entries(counts).forEach(([feeling, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxFeeling = feeling as Feeling;
      }
    });
    
    return maxFeeling;
  };
  
  // Calculate most emotional day
  const getMostEmotionalDay = (): string | null => {
    if (weeklyComplaints.length === 0) return null;
    
    const dayCounts: Record<string, number> = {};
    
    weeklyComplaints.forEach(complaint => {
      const date = new Date(complaint.createdAt);
      const dayStr = format(date, 'EEEE', { locale: id });
      dayCounts[dayStr] = (dayCounts[dayStr] || 0) + 1;
    });
    
    let maxCount = 0;
    let maxDay: string | null = null;
    
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxDay = day;
      }
    });
    
    return maxDay;
  };
  
  const mostFrequentFeeling = getMostFrequentFeeling();
  const mostEmotionalDay = getMostEmotionalDay();
  
  if (totalWeekly === 0) {
    return (
      <motion.div variants={fadeIn}>
        <Card className="border-border/40 shadow-md mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Statistik Minggu Ini</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <BarChart2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-60" />
            <p className="text-muted-foreground mb-1">
              Belum ada data untuk minggu ini
            </p>
            <p className="text-sm text-muted-foreground">
              Mulai ngeluh untuk melihat statistikmu
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div variants={fadeIn}>
      <Card className="border-border/40 shadow-md mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Statistik Minggu Ini</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div variants={slideUp} className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                <span>Total Keluhan</span>
              </h3>
              <p className="text-2xl font-semibold">{totalWeekly}</p>
              <p className="text-xs text-muted-foreground mt-1">7 hari terakhir</p>
            </motion.div>
            
            {mostFrequentFeeling && (
              <motion.div variants={slideUp} className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <span>Mood Terbanyak</span>
                </h3>
                <p className="text-2xl font-semibold flex items-center gap-2">
                  <span>{feelingEmojis[mostFrequentFeeling]}</span>
                  <span>{FEELING_NAMES[mostFrequentFeeling]}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Emosi dominan</p>
              </motion.div>
            )}
            
            {mostEmotionalDay && (
              <motion.div variants={slideUp} className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Hari Paling Emosional</span>
                </h3>
                <p className="text-2xl font-semibold capitalize">{mostEmotionalDay}</p>
                <p className="text-xs text-muted-foreground mt-1">Paling banyak keluhan</p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}