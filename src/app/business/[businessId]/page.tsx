'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getBusinessById } from '@/services/business-service';
import { getOrdersByBusinessId } from '@/services/order-service';
import { Header } from '@/components/header';
import OrderForm from '@/components/order-form';
import { OrderQueue } from '@/components/order-queue';
import { type Order, type CoffeeType, type CoffeeSize } from '@/types';
import { addMinutes } from 'date-fns';
import { addOrder as addOrderService } from '@/services/order-service';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ORDER_INTERVAL_MINUTES = 5;

export default function BusinessPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const [business, setBusiness] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        const businessData = await getBusinessById(businessId);
        if (!businessData) {
          toast({
            title: "Negocio no encontrado",
            description: "El negocio que buscas no existe.",
            variant: "destructive",
          });
          return;
        }

        setBusiness(businessData);
        const ordersData = await getOrdersByBusinessId(businessId);
        setOrders(ordersData);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar la información del negocio.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      loadBusinessData();
    }
  }, [businessId, toast]);

  const addOrder = async (newOrderData: {
    name: string;
    coffeeType: CoffeeType;
    size: CoffeeSize;
    specialInstructions?: string;
  }) => {
    const lastOrder = orders.find(order => order.status === 'pending');
    const now = new Date();
    
    const baseTime = lastOrder && lastOrder.pickupTime > now ? lastOrder.pickupTime : now;
    const pickupTime = addMinutes(baseTime, ORDER_INTERVAL_MINUTES);

    const newOrder: Omit<Order, 'id' | 'createdAt'> = {
      ...newOrderData,
      pickupTime,
      businessId,
      status: 'pending',
    };

    try {
      const addedOrder = await addOrderService(newOrder);
      setOrders((prevOrders) => [addedOrder, ...prevOrders]);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el pedido.",
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

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Negocio no encontrado</h1>
          <p className="text-muted-foreground">El negocio que buscas no existe.</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header businessName={business.name} />
      <main className="container mx-auto px-4 pb-16 flex-grow">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
          <p className="text-muted-foreground">Haz tu pedido y relájate</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-headline text-3xl font-semibold mb-6">Haz tu pedido</h2>
            <OrderForm onSubmit={addOrder} />
          </div>
          <div className="lg:col-span-3">
            <h2 className="font-headline text-3xl font-semibold mb-6">
              Fila actual ({pendingOrders.length} pendientes)
            </h2>
            <OrderQueue orders={pendingOrders} />
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