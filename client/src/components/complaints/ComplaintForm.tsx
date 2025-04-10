import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useComplaintStore } from '@/store/useComplaintStore';
import { Feeling } from '@/types';
import { fadeIn, slideUp } from '@/lib/theme-store';
import { DailyPrompt } from './DailyPrompt';

// Define schema for form validation
const formSchema = z.object({
  text: z.string().min(3, 'Tulis minimal 3 karakter ya...'),
  feeling: z.enum(['kesel', 'sedih', 'capek', 'bingung', 'bete'], {
    required_error: 'Pilih perasaanmu saat ini',
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Emoji mapping for each feeling
const feelingEmojis: Record<Feeling, string> = {
  kesel: '😠',
  sedih: '😢',
  capek: '😫',
  bingung: '😕',
  bete: '😒',
};

export function ComplaintForm() {
  const { addComplaint } = useComplaintStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      feeling: undefined,
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate network request delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // Add new complaint
    addComplaint(values.text, values.feeling);
    
    // Show success toast
    toast({
      title: 'Keluhanmu tersimpan',
      description: 'Nafas dulu yuk, semangat!',
    });
    
    // Reset form
    form.reset();
    setIsSubmitting(false);
  };

  // Get funny random placeholders
  const getRandomPlaceholder = () => {
    const placeholders = [
      'Cerita aja di sini...',
      'Pengen ngeluh apa hari ini?',
      'Tulis keluhanmu di sini...',
      'Sini, sini... curhat dulu...',
      'Hari ini kenapa sih?',
      'Apa yang bikin kamu kesel hari ini?',
    ];
    
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };
  
  // Handle when a prompt is selected
  const handleSelectPrompt = (prompt: string) => {
    form.setValue('text', prompt);
  };

  return (
    <motion.div variants={fadeIn}>
      <Card className="border-border/40 backdrop-blur-md shadow-xl bg-card/80">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center">
            Ngeluh Dulu, Baru Tenang
          </CardTitle>
          <CardDescription className="text-center">
            Tempat aman buat curhat dan ngeluh harian, no judge zone.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Daily Prompt */}
          <DailyPrompt onSelectPrompt={handleSelectPrompt} />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <motion.div variants={slideUp}>
                <FormField
                  control={form.control}
                  name="feeling"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Aku lagi merasa..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(feelingEmojis).map(([feeling, emoji]) => (
                            <SelectItem key={feeling} value={feeling}>
                              <div className="flex items-center gap-2">
                                <span>{emoji}</span>
                                <span className="capitalize">{feeling}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={slideUp}>
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={getRandomPlaceholder()}
                          className="min-h-[160px] text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div
                variants={slideUp}
                className="flex justify-center"
              >
                <Button
                  type="submit"
                  className="w-full md:w-auto transition-all hover:opacity-90 hover:scale-105 font-medium"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      <span>Ngeluh Sekarang</span>
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}