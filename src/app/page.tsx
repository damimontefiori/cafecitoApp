'use client';

import { useState, useEffect } from 'react';
import { addMinutes } from 'date-fns';
import { Header } from '@/components/header';
import OrderForm from '@/components/order-form';
import { OrderQueue } from '@/components/order-queue';
import { type Order, type CoffeeType, type CoffeeSize } from '@/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getOrders, addOrder as addOrderService } from '@/services/order-service';

const ORDER_INTERVAL_MINUTES = 5;

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    };
    fetchOrders();
  }, []);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'coffee-hero');

  const addOrder = async (newOrderData: {
    name: string;
    coffeeType: CoffeeType;
    size: CoffeeSize;
    specialInstructions?: string;
  }) => {
    const lastOrder = orders[0];
    const now = new Date();
    
    const baseTime = lastOrder && lastOrder.pickupTime > now ? lastOrder.pickupTime : now;
    const pickupTime = addMinutes(baseTime, ORDER_INTERVAL_MINUTES);

    const newOrder: Omit<Order, 'id'> = {
      ...newOrderData,
      pickupTime,
    };

    const addedOrder = await addOrderService(newOrder);
    setOrders((prevOrders) => [addedOrder, ...prevOrders]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pb-16 flex-grow">
        {heroImage && (
          <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={1200}
              height={400}
              className="w-full object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-headline text-3xl font-semibold mb-6">Haz tu pedido</h2>
            <OrderForm onSubmit={addOrder} />
          </div>
          <div className="lg:col-span-3">
            <h2 className="font-headline text-3xl font-semibold mb-6">Fila actual</h2>
            <OrderQueue orders={orders} />
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
