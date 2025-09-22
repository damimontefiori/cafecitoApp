'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/services/auth-service';
import { createBusiness, getBusinessByAdminId } from '@/services/business-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  businessName: z.string().min(2, { message: 'El nombre del negocio debe tener al menos 2 caracteres.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<'auth' | 'register'>('auth');
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      setUser(user);
      
      // Check if user already has a business
      const existingBusiness = await getBusinessByAdminId(user.uid);
      if (existingBusiness) {
        router.push(`/admin/${existingBusiness.id}`);
      } else {
        setStep('register');
      }
    } catch (error) {
      toast({
        title: "Error de autenticación",
        description: "No se pudo iniciar sesión con Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessRegistration = async (values: FormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const business = await createBusiness({
        name: values.businessName,
        adminId: user.uid,
        adminEmail: user.email,
      });

      toast({
        title: "¡Negocio registrado!",
        description: `${business.name} ha sido registrado exitosamente.`,
      });

      router.push(`/admin/${business.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el negocio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Coffee className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">CafeCito Admin</CardTitle>
          <CardDescription>
            {step === 'auth' 
              ? 'Inicia sesión para administrar tu negocio' 
              : 'Registra tu negocio'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'auth' ? (
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continuar con Google
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Solo para administradores de negocios
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleBusinessRegistration)} className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Hola {user?.displayName}! Registra tu negocio:
                </div>
                
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del negocio</FormLabel>
                      <FormControl>
                        <Input placeholder="Mi Cafetería" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Registrar negocio
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}