import { motion } from 'framer-motion';
import { BarChart2, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { slideUp } from '../../lib/theme-store';
import { Complaint, Feeling } from '../../types';
import { format, startOfWeek, endOfWeek, isWithinInterval, isToday, isSameDay, eachDayOfInterval } from 'date-fns';
import { id } from 'date-fns/locale';

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

interface WeeklyStatsProps {
  complaints: Complaint[];
}

export function WeeklyStats({ complaints }: WeeklyStatsProps) {
  // Get current week dates
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  // Filter complaints for current week
  const weeklyComplaints = complaints.filter(complaint => {
    const complaintDate = new Date(complaint.createdAt);
    return isWithinInterval(complaintDate, {
      start: weekStart,
      end: weekEnd
    });
  });
  
  // Calculate count by feelings
  const feelingCounts: Record<Feeling, number> = {
    kesel: 0,
    sedih: 0,
    capek: 0,
    bingung: 0,
    bete: 0,
  };
  
  weeklyComplaints.forEach(complaint => {
    feelingCounts[complaint.feeling]++;
  });
  
  // Find the most common feeling
  const mostCommonFeeling = Object.entries(feelingCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count > 0)[0];
  
  // Count complaints by day
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const countsByDay: Record<string, number> = {};
  
  days.forEach(day => {
    const dayComplaints = weeklyComplaints.filter(complaint => 
      isSameDay(new Date(complaint.createdAt), day)
    );
    countsByDay[format(day, 'EEEE', { locale: id })] = dayComplaints.length;
  });
  
  // Find the day with most complaints
  const mostEmotionalDay = Object.entries(countsByDay)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count > 0)[0];
  
  // Count today's complaints
  const todayComplaints = complaints.filter(complaint => 
    isToday(new Date(complaint.createdAt))
  );
  
  // If no data
  if (weeklyComplaints.length === 0) {
    return (
      <motion.div variants={slideUp}>
        <Card className="border-border/40 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <span>Statistik Minggu Ini</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="text-muted-foreground">
              Belum ada data keluhan untuk minggu ini
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div variants={slideUp}>
      <Card className="border-border/40 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <span>Statistik Minggu Ini</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
              <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span>Total Keluhan</span>
              </div>
              <div className="mt-auto">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{weeklyComplaints.length}</span>
                  <span className="text-muted-foreground text-sm ml-1">minggu ini</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {todayComplaints.length} hari ini
                </div>
              </div>
            </div>
            
            {mostCommonFeeling && (
              <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
                <div className="text-sm text-muted-foreground mb-2">
                  Mood Terbanyak
                </div>
                <div className="mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{feelingEmojis[mostCommonFeeling[0] as Feeling]}</span>
                    <div>
                      <div className="font-medium">{FEELING_NAMES[mostCommonFeeling[0] as Feeling]}</div>
                      <div className="text-xs text-muted-foreground">
                        {mostCommonFeeling[1]} keluhan
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {mostEmotionalDay && (
              <div className="bg-muted/50 rounded-lg p-3 flex flex-col">
                <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Hari Paling Emosional</span>
                </div>
                <div className="mt-auto">
                  <div className="font-medium capitalize">{mostEmotionalDay[0]}</div>
                  <div className="text-xs text-muted-foreground">
                    {mostEmotionalDay[1]} keluhan
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}