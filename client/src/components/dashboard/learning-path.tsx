import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, slideUp } from "@/lib/theme";
import { Link } from "wouter";

interface PathStep {
  id: number;
  title: string;
  completed: boolean;
  courseId: number;
  duration: string;
}

interface LearningPathProps {
  title: string;
  description: string;
  steps: PathStep[];
  progress: number;
  className?: string;
}

export function LearningPath({ title, description, steps, progress, className }: LearningPathProps) {
  return (
    <Card className={cn("backdrop-blur-md bg-card border-border/50", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <div className="text-sm font-medium">{progress}% Complete</div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              variants={slideUp}
              className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                step.completed 
                  ? "bg-primary/10" 
                  : index === steps.findIndex(s => !s.completed) 
                    ? "bg-accent/5 hover:bg-accent/10" 
                    : "hover:bg-muted"
              )}
            >
              <div className="flex-shrink-0 mr-3">
                {step.completed ? (
                  <CheckCircle className="h-6 w-6 text-primary" />
                ) : (
                  <Circle className={cn(
                    "h-6 w-6",
                    index === steps.findIndex(s => !s.completed)
                      ? "text-primary/50" 
                      : "text-muted-foreground"
                  )} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className={cn(
                    "text-sm font-medium",
                    step.completed && "line-through text-muted-foreground"
                  )}>
                    {step.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">{step.duration}</span>
                </div>
              </div>
              <Link href={`/course/${step.courseId}`}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2 h-8 w-8"
                  disabled={index !== 0 && !steps[index - 1].completed}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
