import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/theme";
import { UserProfile } from "@/App";

const profileSchema = z.object({
  displayName: z.string().min(3, "Nama harus minimal 3 karakter"),
  bio: z.string().max(200, "Bio maksimal 200 karakter").optional().or(z.literal("")),
  avatarUrl: z.string().url("URL tidak valid").optional().or(z.literal(""))
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile({ userProfile, setUserProfile }: { 
  userProfile: UserProfile, 
  setUserProfile: (user: UserProfile) => void 
}) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  if (!userProfile) {
    navigate("/login");
    return null;
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: userProfile.displayName || "",
      bio: userProfile.bio || "",
      avatarUrl: userProfile.avatarUrl || ""
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    
    try {
      // In a real app you would make an API call here
      setTimeout(() => {
        setUserProfile({
          ...userProfile,
          displayName: data.displayName,
          bio: data.bio || null,
          avatarUrl: data.avatarUrl || null
        });
        
        toast({
          title: "Profil berhasil diperbarui",
          description: "Perubahan telah disimpan",
        });
      }, 500);
    } catch (error) {
      toast({
        title: "Gagal memperbarui profil",
        description: "Silahkan coba lagi nanti",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Profil"
        description="Atur profil dan preferensi akun"
      />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>
                Perbarui data pribadi dan tampilan profilmu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={userProfile.avatarUrl || ""} alt={userProfile.username} />
                  <AvatarFallback className="text-lg">{userProfile.displayName?.[0] || userProfile.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{userProfile.displayName || userProfile.username}</h3>
                  <p className="text-muted-foreground text-sm">@{userProfile.username}</p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Tampilan</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Nama yang ditampilkan" 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Ini akan ditampilkan di profilmu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Ceritakan sedikit tentang dirimu" 
                            className="resize-none"
                            rows={4}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Maksimal 200 karakter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Avatar</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="https://example.com/avatar.jpg" 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Masukkan URL gambar untuk avatar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-1">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                        <span>Menyimpan...</span>
                      </span>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Data Belajar</CardTitle>
              <CardDescription>
                Informasi progres pembelajaranmu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">HTML</p>
                  <p className="text-2xl font-bold">Level {userProfile.htmlLevel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">CSS</p>
                  <p className="text-2xl font-bold">Level {userProfile.cssLevel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">JavaScript</p>
                  <p className="text-2xl font-bold">Level {userProfile.jsLevel}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">Total Poin</p>
                <p className="text-3xl font-bold">{userProfile.totalPoints}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}