'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onAuthChange, signOut } from '@/services/auth-service';
import { getBusinessById } from '@/services/business-service';
import { getOrdersByBusinessId, markOrderAsServed } from '@/services/order-service';
import { Header } from '@/components/header';
import { AdminOrderCard } from '@/components/admin-order-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Order, type AdminUser } from '@/types';
import { Loader2, LogOut, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPanel() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;
  const [user, setUser] = useState<AdminUser | null>(null);
  const [business, setBusiness] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔧 [AdminPanel] useEffect ejecutado, businessId:', businessId);
    
    const unsubscribe = onAuthChange(async (authUser) => {
      console.log('👤 [AdminPanel] Estado de auth cambió:', { 
        user: authUser ? authUser.email : 'null',
        uid: authUser?.uid 
      });
      
      if (!authUser) {
        console.log('❌ [AdminPanel] Usuario no autenticado, redirigiendo');
        router.push('/admin/register');
        return;
      }

      setUser(authUser);
      
      try {
        console.log('🔍 [AdminPanel] Cargando datos del negocio...');
        const businessData = await getBusinessById(businessId);
        console.log('📊 [AdminPanel] Resultado de negocio:', businessData);
        
        if (!businessData) {
          console.log('❌ [AdminPanel] Negocio no encontrado');
          toast({
            title: "Negocio no encontrado",
            description: "El negocio que buscas no existe.",
            variant: "destructive",
          });
          router.push('/admin/register');
          return;
        }

        if (businessData.adminId !== authUser.uid) {
          console.log('🚫 [AdminPanel] Acceso denegado, adminId:', businessData.adminId, 'userUid:', authUser.uid);
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para administrar este negocio.",
            variant: "destructive",
          });
          router.push('/admin/register');
          return;
        }

        setBusiness(businessData);
        console.log('✅ [AdminPanel] Negocio cargado exitosamente, cargando órdenes...');
        await loadOrders();
      } catch (error) {
        console.error('🚨 [AdminPanel] Error al cargar información del negocio:', error);
        toast({
          title: "Error",
          description: `No se pudo cargar la información del negocio. Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [businessId, router, toast]);

  const loadOrders = async () => {
    console.log('📦 [AdminPanel] Cargando órdenes...');
    try {
      const ordersData = await getOrdersByBusinessId(businessId);
      console.log('📦 [AdminPanel] Órdenes cargadas:', ordersData.length);
      setOrders(ordersData);
    } catch (error) {
      console.error('🚨 [AdminPanel] Error al cargar órdenes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsServed = async (orderId: string) => {
    try {
      await markOrderAsServed(orderId);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'served' } : order
        )
      );
      toast({
        title: "Pedido marcado como servido",
        description: "El pedido ha sido actualizado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar el pedido como servido.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/register');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!business || !user) {
    return null;
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const servedOrders = orders.filter(order => order.status === 'served');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header businessName={`${business.name} - Admin`} />
      
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Panel de Administración</h2>
            <p className="text-muted-foreground">Hola {user.displayName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open(`/business/${businessId}`, '_blank')}>
              Ver página pública
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-16 flex-grow">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pendientes ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="served" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Servidos ({servedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              Todos ({orders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="grid gap-4">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay pedidos pendientes
                </div>
              ) : (
                pendingOrders.map(order => (
                  <AdminOrderCard 
                    key={order.id} 
                    order={order} 
                    onMarkAsServed={handleMarkAsServed}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="served" className="mt-6">
            <div className="grid gap-4">
              {servedOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay pedidos servidos
                </div>
              ) : (
                servedOrders.map(order => (
                  <AdminOrderCard 
                    key={order.id} 
                    order={order} 
                    onMarkAsServed={handleMarkAsServed}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay pedidos
                </div>
              ) : (
                orders.map(order => (
                  <AdminOrderCard 
                    key={order.id} 
                    order={order} 
                    onMarkAsServed={handleMarkAsServed}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}