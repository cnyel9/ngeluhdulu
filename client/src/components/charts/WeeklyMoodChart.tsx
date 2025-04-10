import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays } from 'date-fns';
import { id } from 'date-fns/locale';
import type { DailyMoodData, Feeling } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fadeIn } from '@/lib/theme-store';
import { useIsMobile } from '@/hooks/use-mobile';

// Color mapping for each feeling
const COLORS: Record<Feeling, string> = {
  kesel: '#ef4444',
  sedih: '#3b82f6',
  capek: '#f97316',
  bingung: '#8b5cf6',
  bete: '#6b7280',
};

// Display name for each feeling
const FEELING_NAMES: Record<Feeling, string> = {
  kesel: 'Kesel',
  sedih: 'Sedih',
  capek: 'Capek',
  bingung: 'Bingung',
  bete: 'Bete',
};

interface WeeklyMoodChartProps {
  data: DailyMoodData[];
}

export function WeeklyMoodChart({ data }: WeeklyMoodChartProps) {
  const isMobile = useIsMobile();
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      
      return (
        <div className="bg-popover p-3 shadow-md border border-border rounded-md">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span>{FEELING_NAMES[entry.dataKey as Feeling]}</span>
              </div>
              <span>{entry.value} keluhan</span>
            </div>
          ))}
          <div className="border-t border-border mt-2 pt-2 flex justify-between">
            <span className="font-medium">Total:</span>
            <span>{total} keluhan</span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (data.length === 0) {
    return (
      <Card className="border-border/40 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Mood 7 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <p className="text-muted-foreground">Belum ada data mood mingguan</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div variants={fadeIn}>
      <Card className="border-border/40 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Mood 7 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6">
          <div className="w-full" style={{ height: isMobile ? '250px' : '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: isMobile ? 0 : 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  fontSize={isMobile ? 10 : 12}
                  tickMargin={5}
                />
                <YAxis 
                  allowDecimals={false}
                  fontSize={isMobile ? 10 : 12}
                  width={isMobile ? 25 : 35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => FEELING_NAMES[value as Feeling]}
                  wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
                />
                {Object.entries(COLORS).map(([feeling, color]) => (
                  <Bar 
                    key={feeling} 
                    dataKey={feeling} 
                    fill={color} 
                    stackId="a"
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}