'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
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
import { auth } from '@/lib/firebase';

const formSchema = z.object({
  businessName: z.string().min(2, { message: 'El nombre del negocio debe tener al menos 2 caracteres.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminRegister() {
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'auth' | 'register'>('auth');
  const [businessCheckDone, setBusinessCheckDone] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
    },
  });

  // Handle user authentication state changes
  useEffect(() => {
    console.log('🔧 [RegisterPage] useEffect ejecutado:', { 
      loading, 
      user: user?.email, 
      businessCheckDone, 
      step 
    });
    
    if (loading) {
      console.log('⏳ [RegisterPage] Todavía cargando autenticación...');
      return; // Still checking auth state
    }
    
    if (user && !businessCheckDone) {
      // User is authenticated, check if they have a business
      const checkBusiness = async () => {
        console.log('🔍 [RegisterPage] Verificando si el usuario ya tiene negocio...');
        try {
          const existingBusiness = await getBusinessByAdminId(user.uid);
          console.log('📊 [RegisterPage] Negocio existente:', existingBusiness);
          
          if (existingBusiness) {
            console.log('✅ [RegisterPage] Usuario ya tiene negocio, redirigiendo...');
            router.push(`/admin/${existingBusiness.id}`);
          } else {
            console.log('📝 [RegisterPage] Usuario no tiene negocio, mostrando formulario de registro');
            setStep('register');
          }
        } catch (error) {
          console.error('🚨 [RegisterPage] Error checking business:', error);
          setStep('register');
        } finally {
          setBusinessCheckDone(true);
        }
      };
      
      checkBusiness();
    } else if (!user && !loading) {
      // User is not authenticated
      console.log('❌ [RegisterPage] Usuario no autenticado');
      setStep('auth');
      setBusinessCheckDone(true);
    }
  }, [user, loading, router]); // Removed businessCheckDone from dependencies

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      
      // If signInWithGoogle returns null, it means redirect was initiated
      if (result === null) {
        // Redirect will happen, no need to do anything
        return;
      }
      
      // If we get a user back (popup worked), the useEffect will handle the business check
      // No need to do anything here as useEffect will trigger
      
    } catch (error: any) {
      console.error('Authentication error details:', error);
      
      let errorMessage = "No se pudo iniciar sesión con Google.";
      
      if (error.code) {
        switch (error.code) {
          case 'auth/unauthorized-domain':
            errorMessage = "Dominio no autorizado. Contacta al administrador.";
            break;
          case 'auth/popup-blocked':
            errorMessage = "El popup fue bloqueado. Permite popups para este sitio.";
            break;
          case 'auth/popup-closed-by-user':
            errorMessage = "Autenticación cancelada por el usuario.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Error de conexión. Verifica tu internet.";
            break;
          default:
            errorMessage = `Error: ${error.code} - ${error.message}`;
        }
      }
      
      toast({
        title: "Error de autenticación",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessRegistration = async (values: FormValues) => {
    console.log('🏢 [RegisterPage] Iniciando registro de negocio:', values.businessName);
    
    if (!user) {
      console.log('❌ [RegisterPage] No hay usuario autenticado');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('📤 [RegisterPage] Llamando a createBusiness...');
      const business = await createBusiness({
        name: values.businessName,
        adminId: user.uid,
        adminEmail: user.email || '',
      });

      console.log('✅ [RegisterPage] Negocio creado exitosamente:', business);

      toast({
        title: "¡Negocio registrado!",
        description: `${business.name} ha sido registrado exitosamente.`,
      });

      console.log('🧭 [RegisterPage] Navegando a:', `/admin/${business.id}`);
      
      // Use window.location.href for immediate navigation to avoid conflicts
      window.location.href = `/admin/${business.id}`;
      
    } catch (error) {
      console.error('🚨 [RegisterPage] Error registrando negocio:', error);
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
            {loading 
              ? 'Verificando autenticación...'
              : step === 'auth' 
                ? 'Inicia sesión para administrar tu negocio' 
                : 'Registra tu negocio'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">
                Verificando autenticación...
              </p>
            </div>
          ) : step === 'auth' ? (
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