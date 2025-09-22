import { Order } from '@/types';
import { OrderCard } from './order-card';
import { Coffee } from 'lucide-react';

interface OrderQueueProps {
  orders: Order[];
}

export function OrderQueue({ orders }: OrderQueueProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg h-full bg-card">
        <Coffee className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground font-medium">La cola está vacía.</p>
        <p className="text-sm text-muted-foreground">¡Haz un pedido para empezar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
