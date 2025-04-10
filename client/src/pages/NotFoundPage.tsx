import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { fadeIn } from '../lib/theme-store';
import { useTitle } from '../hooks/use-title';

export default function NotFoundPage() {
  useTitle('Halaman Tidak Ditemukan - Ngeluh Dulu, Baru Tenang');
  
  return (
    <motion.div
      variants={fadeIn}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="mb-6 bg-primary/10 p-6 rounded-full">
        <span className="text-6xl">😵</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Halaman Tidak Ditemukan</h1>
      
      <p className="text-muted-foreground max-w-md mb-8">
        Maaf, halaman yang kamu cari nggak ada. Tapi jangan kesel dulu ya, kita masih punya tempat buat kamu ngeluh.
      </p>
      
      <Button asChild>
        <a href="/" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </a>
      </Button>
    </motion.div>
  );
}