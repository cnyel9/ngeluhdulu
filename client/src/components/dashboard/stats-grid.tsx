import { motion } from "framer-motion";
import { Users, Clock, Award, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, popIn } from "@/lib/theme";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: {
    value: string;
    positive: boolean;
  };
  color: "purple" | "blue" | "pink" | "green";
  className?: string;
}

function StatCard({ title, value, icon, change, color, className }: StatCardProps) {
  const colorMap = {
    purple: {
      bg: "bg-purple-500/20",
      text: "text-purple-500"
    },
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-500"
    },
    pink: {
      bg: "bg-pink-500/20",
      text: "text-pink-500"
    },
    green: {
      bg: "bg-green-500/20",
      text: "text-green-500"
    }
  };

  return (
    <motion.div 
      className={cn(
        "backdrop-blur-md rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-5px]",
        "bg-card border border-border/50",
        className
      )}
      variants={popIn}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-lg", colorMap[color].bg, colorMap[color].text)}>
          {icon}
        </div>
      </div>
      <div className="flex items-center text-sm">
        <span className={cn(
          "flex items-center",
          change.positive ? "text-green-500" : "text-red-500"
        )}>
          <span className="mr-1">
            {change.positive ? "↑" : "↓"}
          </span>
          {change.value}
        </span>
        <span className="ml-2 text-muted-foreground">vs last month</span>
      </div>
    </motion.div>
  );
}

export function StatsGrid() {
  const stats = [
    {
      title: "Courses Enrolled",
      value: "12",
      icon: <BookOpen className="h-5 w-5" />,
      change: { value: "3", positive: true },
      color: "purple" as const
    },
    {
      title: "Hours Learned",
      value: "68.5",
      icon: <Clock className="h-5 w-5" />,
      change: { value: "12.4", positive: true },
      color: "blue" as const
    },
    {
      title: "Certificates Earned",
      value: "5",
      icon: <Award className="h-5 w-5" />,
      change: { value: "2", positive: true },
      color: "pink" as const
    },
    {
      title: "Community Rank",
      value: "Top 15%",
      icon: <Users className="h-5 w-5" />,
      change: { value: "5%", positive: true },
      color: "green" as const
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </motion.div>
  );
}
