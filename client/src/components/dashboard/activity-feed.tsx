import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, FileText, Award, BookOpen, Book, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, slideUp } from "@/lib/theme";

interface ActivityItem {
  id: number;
  type: 'course_started' | 'course_completed' | 'certificate' | 'article_read' | 'assessment_completed' | 'upcoming_event';
  title: string;
  description: string;
  time: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'course_started':
        return <BookOpen className="text-purple-500" />;
      case 'course_completed':
        return <Layers className="text-green-500" />;
      case 'certificate':
        return <Award className="text-amber-500" />;
      case 'article_read':
        return <FileText className="text-blue-500" />;
      case 'assessment_completed':
        return <Book className="text-pink-500" />;
      case 'upcoming_event':
        return <Calendar className="text-indigo-500" />;
    }
  };

  return (
    <Card className={cn("backdrop-blur-md bg-card border-border/50", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-sm" aria-label="View all activities">
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {activities.map((activity) => (
            <motion.div 
              key={activity.id}
              className="flex items-start"
              variants={slideUp}
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800/30 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{activity.title}</h3>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
