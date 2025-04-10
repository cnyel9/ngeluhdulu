import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { fadeIn } from '../../lib/theme-store';

type PromptType = 'general' | 'work' | 'school' | 'personal';

interface DailyPromptProps {
  onSelectPrompt: (prompt: string) => void;
}

export function DailyPrompt({ onSelectPrompt }: DailyPromptProps) {
  const [activeType, setActiveType] = useState<PromptType>('general');
  const [dailyPrompt, setDailyPrompt] = useState<string>('');
  
  // Array of prompts by category
  const prompts: Record<PromptType, string[]> = {
    general: [
      "Apa yang bikin kamu kesel hari ini?",
      "Hal apa yang bikin kamu capek banget minggu ini?",
      "Siapa yang nyebelin banget hari ini?",
      "Kebiasaan orang lain yang bikin kamu bete?",
      "Apa yang bikin mood kamu hancur hari ini?",
      "Situasi apa yang bikin kamu nggak nyaman?",
      "Kejadian apa yang bikin kamu pengen teriak?",
    ],
    work: [
      "Apa yang bikin kamu stres di kantor/kerjaan?",
      "Gimana sikap bosmu yang bikin kamu kesel?",
      "Rekan kerja yang paling bikin kamu jengkel?",
      "Deadline yang bikin kamu pusing minggu ini?",
      "Klien/customer yang bikin kamu emosi?",
      "Proyekmu ada kendala apa yang nyebelin?",
      "Meeting yang buang-buang waktu hari ini?",
    ],
    school: [
      "Dosen/guru mana yang bikin kamu frustrasi?",
      "Tugas apa yang deadline-nya nggak masuk akal?",
      "Temen kelompok yang nggak kontribusi?",
      "Mata kuliah/pelajaran apa yang bikin pusing?",
      "Presentasi yang bikin kamu gugup?",
      "Nilai yang nggak sesuai ekspektasi?",
      "Aturan kampus/sekolah yang nggak masuk akal?",
    ],
    personal: [
      "Apa yang bikin kamu sedih akhir-akhir ini?",
      "Hubungan yang bikin kamu lelah mental?",
      "Kebiasaan apa yang ingin kamu ubah tapi susah?",
      "Apa ketakutan terbesarmu saat ini?",
      "Harapan apa yang belum terwujud?",
      "Hal kecil apa yang bikin kamu overthinking?",
      "Apa yang jadi beban pikiranmu sekarang?",
    ],
  };
  
  // Get random prompt based on the day and selected type
  useEffect(() => {
    const getPromptForToday = () => {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Use the date as a seed for random selection
      const dateHash = dateString.split('').reduce((a, b) => {
        return a + b.charCodeAt(0);
      }, 0);
      
      const selectedPrompts = prompts[activeType];
      const promptIndex = dateHash % selectedPrompts.length;
      
      return selectedPrompts[promptIndex];
    };
    
    setDailyPrompt(getPromptForToday());
  }, [activeType]);
  
  // Handle click on prompt
  const handlePromptClick = () => {
    onSelectPrompt(dailyPrompt);
  };
  
  // Get random prompt from the active category
  const getRandomPrompt = () => {
    const selectedPrompts = prompts[activeType];
    const randomIndex = Math.floor(Math.random() * selectedPrompts.length);
    const prompt = selectedPrompts[randomIndex];
    setDailyPrompt(prompt);
  };
  
  return (
    <motion.div 
      variants={fadeIn}
      className="mb-6 bg-muted/50 p-4 rounded-lg shadow-sm border border-border/60"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Inspirasi Keluhan Hari Ini</span>
        </h3>
        
        <button 
          onClick={getRandomPrompt}
          className="text-xs text-primary hover:text-primary/80 font-medium"
        >
          Ganti
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setActiveType('general')}
          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
            activeType === 'general'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          Umum
        </button>
        <button
          onClick={() => setActiveType('work')}
          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
            activeType === 'work'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          Kerjaan
        </button>
        <button
          onClick={() => setActiveType('school')}
          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
            activeType === 'school'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          Sekolah
        </button>
        <button
          onClick={() => setActiveType('personal')}
          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
            activeType === 'personal'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          Personal
        </button>
      </div>
      
      <button
        onClick={handlePromptClick}
        className="w-full text-left p-3 rounded-md bg-background hover:bg-background/90 border border-border/50 transition-colors"
      >
        <p className="font-medium">{dailyPrompt}</p>
        <p className="text-xs text-muted-foreground mt-1">Klik untuk gunakan prompt ini</p>
      </button>
    </motion.div>
  );
}