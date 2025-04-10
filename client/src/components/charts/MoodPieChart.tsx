import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FeelingCount, Feeling } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { fadeIn } from '../../lib/theme-store';
import { useIsMobile } from '../../hooks/use-mobile';

// Emoji mapping for each feeling
const feelingEmojis: Record<Feeling, string> = {
  kesel: '😠',
  sedih: '😢',
  capek: '😫',
  bingung: '😕',
  bete: '😒',
};

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

interface MoodPieChartProps {
  data: FeelingCount[];
}

export function MoodPieChart({ data }: MoodPieChartProps) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const total = data.reduce((sum, entry) => sum + entry.count, 0);
  
  // Handle mouse hover
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: FeelingCount }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const feeling = data.feeling as Feeling;
      const percentage = ((data.count / total) * 100).toFixed(1);
      
      return (
        <div className="bg-popover p-3 shadow-md border border-border rounded-md">
          <p className="flex items-center gap-2 font-medium">
            <span>{feelingEmojis[feeling]}</span>
            <span>{FEELING_NAMES[feeling]}</span>
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold">{data.count}</span> keluhan ({percentage}%)
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  // Custom legend
  const renderLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {data.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[entry.feeling] }}
            />
            <span className={`text-sm ${activeIndex === index ? 'font-medium' : ''}`}>
              {feelingEmojis[entry.feeling]} {FEELING_NAMES[entry.feeling]}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (total === 0) {
    return (
      <Card className="border-border/40 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Mood Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <p className="text-muted-foreground">Belum ada data mood untuk ditampilkan</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div variants={fadeIn}>
      <Card className="border-border/40 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Mood Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="w-full" style={{ height: isMobile ? '200px' : '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 70 : 90}
                  paddingAngle={2}
                  dataKey="count"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.feeling]}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}