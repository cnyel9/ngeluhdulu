import { motion } from 'framer-motion';
import { BarChart2, PieChart } from 'lucide-react';
import { useComplaintStore } from '../store/useComplaintStore';
import { MoodPieChart } from '../components/charts/MoodPieChart';
import { WeeklyMoodChart } from '../components/charts/WeeklyMoodChart';
import { WeeklySummary } from '../components/charts/WeeklySummary';
import { MotivationGenerator } from '../components/complaints/MotivationGenerator';
import { fadeIn, staggerContainer, slideUp } from '../lib/theme-store';
import { useTitle } from '../hooks/use-title';
import { getFeelingCounts, getDailyMoodData, getLastWeekComplaints } from '../utils/analytics';

export default function ChartPage() {
  useTitle('Grafik Mood - Ngeluh Dulu, Baru Tenang');
  
  const { complaints } = useComplaintStore();
  
  // Generate data for charts
  const weeklyComplaints = getLastWeekComplaints(complaints);
  const feelingCounts = getFeelingCounts(complaints);
  const dailyMoodData = getDailyMoodData(complaints);
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.header
        variants={fadeIn}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-semibold mb-2">Visualisasi Mood</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Lihat bagaimana pola perasaanmu beberapa waktu belakangan ini
        </p>
      </motion.header>
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {complaints.length === 0 ? (
          <motion.div 
            variants={slideUp}
            className="text-center py-8"
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <BarChart2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Belum Ada Data</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Tambahkan beberapa keluhan terlebih dahulu untuk melihat visualisasi data mood kamu.
            </p>
            <MotivationGenerator />
          </motion.div>
        ) : (
          <>
            <motion.div variants={slideUp}>
              <WeeklySummary complaints={complaints} />
            </motion.div>

            <motion.div variants={slideUp}>
              <WeeklyMoodChart data={dailyMoodData} />
            </motion.div>
            
            <motion.div variants={slideUp}>
              <MoodPieChart data={feelingCounts} />
            </motion.div>
            
            <motion.div variants={slideUp}>
              <div className="border-t border-border/40 pt-8">
                <MotivationGenerator />
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}