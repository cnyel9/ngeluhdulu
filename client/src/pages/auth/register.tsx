import { useState } from "react";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Code } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "@/App";

const registerSchema = z.object({
  username: z.string().min(3, "Username harus minimal 3 karakter"),
  email: z.string().email("Masukkan email yang valid"),
  password: z.string().min(6, "Password harus minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak sama",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register({ setUserProfile }: { setUserProfile: (user: UserProfile) => void }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    
    // Demo: just create a simulated user
    const fakeUser = {
      id: 1,
      username: data.username,
      displayName: data.username,
      bio: null,
      avatarUrl: null,
      role: "user",
      htmlLevel: 1,
      cssLevel: 1,
      jsLevel: 1,
      totalPoints: 0
    };
    
    try {
      // In a real app, make a register API call here
      setTimeout(() => {
        setUserProfile(fakeUser);
        toast({
          title: "Berhasil mendaftar!",
          description: "Selamat datang di Malas Ngoding",
        });
        navigate("/");
      }, 500);
    } catch (error) {
      toast({
        title: "Gagal mendaftar",
        description: "Silahkan coba lagi nanti",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="rounded-full bg-primary p-2 mb-4">
            <Code className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Malas Ngoding</h1>
          <p className="text-muted-foreground mt-2">Belajar coding jadi lebih mudah dan menyenangkan</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Buat Akun</CardTitle>
            <CardDescription>
              Daftar akun baru untuk mulai belajar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="malas.ngoding" 
                          disabled={isLoading}
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="kamu@example.com" 
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="••••••••" 
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="••••••••" 
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                      <span>Mendaftar...</span>
                    </span>
                  ) : (
                    "Daftar"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login">
                <Button variant="link" className="p-0 h-auto text-sm">
                  Login
                </Button>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}