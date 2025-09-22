import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              {order.name}
            </CardTitle>
            <CardDescription>
              {order.size} {order.coffeeType}
            </CardDescription>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
             <div className="flex items-center justify-end gap-2 text-primary font-bold">
                <Clock className="w-5 h-5"/>
                <span className="text-lg">{format(order.pickupTime, 'h:mm a')}</span>
             </div>
             <p className="text-xs text-muted-foreground">Hora de recogida</p>
          </div>
        </div>
      </CardHeader>
      {order.specialInstructions && (
        <CardContent>
          <Separator className="mb-4" />
          <div>
            <h4 className="font-semibold text-sm mb-1">Instrucciones especiales:</h4>
            <p className="text-sm text-muted-foreground">{order.specialInstructions}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
