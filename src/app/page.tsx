'use client';

import { useState, useEffect } from 'react';
import { getAllBusinesses } from '@/services/business-service';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Business } from '@/types';
import { Loader2, Coffee, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const businessData = await getAllBusinesses();
        setBusinesses(businessData);
      } catch (error) {
        console.error('Error loading businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  const handleBusinessSelect = (businessId: string) => {
    router.push(`/business/${businessId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pb-16 flex-grow">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Elige tu cafetería</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Selecciona la cafetería donde quieres hacer tu pedido. 
            Cada negocio tiene su propia fila y horarios.
          </p>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <Coffee className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay cafeterías disponibles</h3>
            <p className="text-muted-foreground mb-6">
              Aún no hay negocios registrados en la plataforma.
            </p>
            <Button 
              onClick={() => router.push('/admin/register')}
              variant="outline"
            >
              ¿Eres dueño de una cafetería? Regístrate aquí
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <Card 
                key={business.id} 
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                onClick={() => handleBusinessSelect(business.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    {business.name}
                  </CardTitle>
                  <CardDescription>
                    Administrado por {business.adminEmail}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Hacer pedido
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-flex gap-4">
            <Button 
              variant="outline"
              onClick={() => router.push('/admin/register')}
            >
              Acceso para administradores
            </Button>
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <a href="https://linkedin.com/in/damian-montefiori" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Visita mi LinkedIn
        </a>
      </footer>
    </div>
  );
}
