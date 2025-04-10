import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { Complaint, Feeling, FeelingCount, DailyMoodData } from '@/types';

/**
 * Get feeling counts from complaints
 */
export function getFeelingCounts(complaints: Complaint[]): FeelingCount[] {
  const feelings: Feeling[] = ['kesel', 'sedih', 'capek', 'bingung', 'bete'];
  const counts: Record<Feeling, number> = {
    kesel: 0,
    sedih: 0,
    capek: 0,
    bingung: 0,
    bete: 0,
  };
  
  // Count occurrences of each feeling
  complaints.forEach((complaint) => {
    counts[complaint.feeling]++;
  });
  
  // Convert to array for chart
  return feelings
    .map((feeling) => ({
      feeling,
      count: counts[feeling],
    }))
    .filter((item) => item.count > 0); // Only include feelings with count > 0
}

/**
 * Get complaints from the last 7 days
 */
export function getLastWeekComplaints(complaints: Complaint[]): Complaint[] {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6); // 7 days including today
  
  return complaints.filter((complaint) => {
    const complaintDate = new Date(complaint.createdAt);
    return isWithinInterval(complaintDate, {
      start: startOfDay(sevenDaysAgo),
      end: today,
    });
  });
}

/**
 * Get daily mood data for the last 7 days
 */
export function getDailyMoodData(complaints: Complaint[]): DailyMoodData[] {
  const today = new Date();
  const result: DailyMoodData[] = [];
  
  // Generate data for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dayStr = format(date, 'E, d MMM', { locale: id });
    
    // Initialize data for the day
    const dayData: DailyMoodData = {
      date: dayStr,
      kesel: 0,
      sedih: 0,
      capek: 0,
      bingung: 0,
      bete: 0,
    };
    
    // Filter complaints for this day
    const dayComplaints = complaints.filter((complaint) => {
      const complaintDate = new Date(complaint.createdAt);
      return startOfDay(complaintDate).getTime() === startOfDay(date).getTime();
    });
    
    // Count feelings for this day
    dayComplaints.forEach((complaint) => {
      dayData[complaint.feeling]++;
    });
    
    result.push(dayData);
  }
  
  return result;
}

/**
 * Count total complaints by time period
 */
export function getComplaintStats(complaints: Complaint[]) {
  const today = new Date();
  const todayComplaints = complaints.filter(complaint => {
    const complaintDate = new Date(complaint.createdAt);
    return startOfDay(complaintDate).getTime() === startOfDay(today).getTime();
  });
  
  const yesterdayDate = subDays(today, 1);
  const yesterdayComplaints = complaints.filter(complaint => {
    const complaintDate = new Date(complaint.createdAt);
    return startOfDay(complaintDate).getTime() === startOfDay(yesterdayDate).getTime();
  });
  
  const weekComplaints = getLastWeekComplaints(complaints);
  
  return {
    total: complaints.length,
    today: todayComplaints.length,
    yesterday: yesterdayComplaints.length,
    week: weekComplaints.length,
    mostFrequentFeeling: getMostFrequentFeeling(complaints),
  };
}

/**
 * Get the most frequent feeling
 */
function getMostFrequentFeeling(complaints: Complaint[]): Feeling | null {
  if (complaints.length === 0) return null;
  
  const counts = getFeelingCounts(complaints);
  if (counts.length === 0) return null;
  
  // Sort by count in descending order
  counts.sort((a, b) => b.count - a.count);
  
  return counts[0].feeling;
}