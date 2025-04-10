import { motion } from 'framer-motion';
import { Heart, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { fadeIn, slideUp, staggerContainer } from '../lib/theme-store';
import { useTitle } from '../hooks/use-title';
import { Button } from '../components/ui/button';

export default function AboutPage() {
  useTitle('Tentang - Ngeluh Dulu, Baru Tenang');
  
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        variants={fadeIn}
        className="text-center mb-8"
      >
        <div className="inline-block text-4xl mb-3">
          <span className="p-3 bg-primary/10 rounded-xl">😤</span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Tentang Aplikasi Ini</h1>
        <p className="text-muted-foreground">
          Tempat aman untuk mencurahkan keluh kesah tanpa dihakimi
        </p>
      </motion.div>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={slideUp}>
          <Card className="border-border/40 shadow-md">
            <CardHeader>
              <CardTitle>Tentang "Ngeluh Dulu, Baru Tenang"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Aplikasi ini didesain sebagai tempat yang aman dan pribadi untuk menumpahkan segala keluh kesah, frustrasi, dan emosi negatif sehari-hari. 
                Karena terkadang, untuk bisa menemukan ketenangan, kita perlu mengeluarkan dulu apa yang mengganggu pikiran.
              </p>
              <p>
                Semua data keluhan kamu tersimpan secara lokal di browser, tanpa perlu login atau registrasi, 
                sehingga privasimu tetap terjaga. Tidak ada yang akan menghakimi keluhanmu di sini!
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={slideUp}>
          <Card className="border-border/40 shadow-md">
            <CardHeader>
              <CardTitle>Kreator</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium">Levi Setiadi</p>
                <Button variant="link" className="flex items-center gap-2 text-primary p-0" asChild>
                  <a 
                    href="https://instagram.com/y2el.nine" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>@y2el.nine</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={slideUp}>
          <div className="text-center pt-4 pb-6 text-muted-foreground text-sm">
            <p className="flex items-center justify-center gap-1 mb-2">
              <span>Dibuat dengan</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>oleh Levi Setiadi</span>
            </p>
            <p>
              © {new Date().getFullYear()} Ngeluh Dulu, Baru Tenang
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}