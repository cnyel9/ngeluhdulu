import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Compass, BookOpen } from "lucide-react";
import { fadeIn, slideUp } from "@/lib/theme";
import { useLocation } from "wouter";

interface HeroSectionProps {
  userName: string;
}

export function HeroSection({ userName }: HeroSectionProps) {
  const [, navigate] = useLocation();

  const handleExplore = () => {
    navigate("/browse-courses");
  };

  const handleResume = () => {
    navigate("/my-learning");
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-xl mb-10"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-500 p-8 sm:p-12 rounded-xl">
        {/* Abstract background elements */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-pink-500 opacity-20 blur-2xl" />
        <div className="absolute top-10 right-20 w-20 h-20 rounded-full bg-blue-600 opacity-20 blur-xl" />
        <div className="absolute bottom-20 left-40 w-32 h-32 rounded-full bg-purple-600 opacity-10 blur-xl" />
        
        <div className="max-w-2xl relative z-10">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold font-heading mb-3 text-white"
            variants={slideUp}
          >
            Welcome back, {userName}
          </motion.h1>
          
          <motion.p 
            className="text-lg opacity-90 mb-6 text-white"
            variants={slideUp}
          >
            Continue your learning journey with our premium courses and personalized recommendations
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            variants={slideUp}
          >
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-opacity-90 shadow-lg transition-all transform hover:translate-y-[-2px]"
              onClick={handleExplore}
            >
              <Compass className="mr-2 h-5 w-5" />
              Explore Courses
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white hover:bg-opacity-10 transition-all transform hover:translate-y-[-2px]"
              onClick={handleResume}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Resume Learning
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
