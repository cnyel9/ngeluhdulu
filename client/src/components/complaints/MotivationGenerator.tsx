import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fadeIn, popIn } from '@/lib/theme-store';

const QUOTES = [
  {
    text: "Kadang hidup emang bikin kesel. Tapi besok pasti ada kesel yang baru lagi kok.",
    author: "Kata Orang Bijak"
  },
  {
    text: "Kalau kamu ngerasa hidupmu susah, coba nonton berita. Biar tau masalahmu itu cuma sesendok di gelas orang lain.",
    author: "Kata Orang Bijak"
  },
  {
    text: "Yang sabar ya. Meski banyak masalah, jangan lupa ngeluh di aplikasi ini aja.",
    author: "Admin Ngeluh Dulu"
  },
  {
    text: "Gak ada masalah yang gak selesai dengan tidur yang cukup sama makanan enak.",
    author: "Penulis Buku Self-Help"
  },
  {
    text: "Hari ini susah, besok juga mungkin susah, tapi lusa mungkin sudah agak mendingan.",
    author: "Kata Orang Bijak"
  },
  {
    text: "Kalo ngerasa capek, ya istirahat dulu aja. Jangan maksa sampe burnout.",
    author: "Ahli Kesehatan Mental"
  },
  {
    text: "Kalau hari ini terasa berat, besok pasti lebih berat. Karena tubuhmu tambah otot.",
    author: "Pelatih Gym"
  },
  {
    text: "Tenang, kamu gak sendirian kok. Ada milyaran orang lain yang juga lagi pusing hari ini.",
    author: "Fakta Menenangkan"
  },
  {
    text: "Ketawa aja dulu, masalahnya dipikirkan nanti. Toh mikir terus juga gak nyelesein apa-apa.",
    author: "Filosofi Santuy"
  },
  {
    text: "Terkadang yang kita butuhkan hanyalah istirahat dan es krim satu liter.",
    author: "Terapis Ice Cream"
  },
];

export function MotivationGenerator() {
  const [quote, setQuote] = useState<typeof QUOTES[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  
  const generateRandomQuote = () => {
    setIsLoading(true);
    setShowCard(true);
    
    // Simulate loading for a more satisfying experience
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setQuote(QUOTES[randomIndex]);
      setIsLoading(false);
    }, 600);
  };
  
  return (
    <motion.div variants={fadeIn} className="mb-6">
      <div className="flex justify-center">
        <Button
          onClick={generateRandomQuote}
          variant="outline"
          size="lg"
          className="bg-primary/10 border-primary/20 hover:bg-primary/20"
          disabled={isLoading}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? 'Mencari Motivasi...' : 'Beri Aku Motivasi'}
        </Button>
      </div>
      
      {showCard && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 pb-4 text-center">
              {isLoading ? (
                <div className="flex flex-col items-center py-4">
                  <div className="h-5 w-5 rounded-full border-2 border-primary border-r-transparent animate-spin mb-2" />
                  <p className="text-muted-foreground">Mencari quote yang pas...</p>
                </div>
              ) : (
                <>
                  <blockquote className="mb-2 text-lg font-medium italic">
                    "{quote?.text}"
                  </blockquote>
                  <footer className="text-sm text-muted-foreground">
                    — {quote?.author}
                  </footer>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}