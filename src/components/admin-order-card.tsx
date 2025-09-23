import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, User, Check, Coffee } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AdminOrderCardProps {
  order: Order;
  onMarkAsServed: (orderId: string) => void;
  isNew?: boolean;
}

export function AdminOrderCard({ order, onMarkAsServed, isNew = false }: AdminOrderCardProps) {
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkAsServed = async () => {
    setIsMarking(true);
    await onMarkAsServed(order.id);
    setIsMarking(false);
  };

  const getStatusBadge = () => {
    return order.status === 'pending' ? (
      <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
        Pendiente
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">
        Servido
      </Badge>
    );
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isNew ? 'ring-2 ring-green-500 bg-green-50 animate-pulse' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-4 w-4" />
              {order.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Coffee className="h-3 w-3" />
                {order.coffeeType} - {order.size}
              </span>
              {getStatusBadge()}
            </CardDescription>
          </div>
          <div className="text-right text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(order.pickupTime, 'HH:mm', { locale: es })}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(order.createdAt, 'dd/MM HH:mm', { locale: es })}
            </p>
          </div>
        </div>
      </CardHeader>
      
      {(order.specialInstructions || order.status === 'pending') && (
        <CardContent>
          {order.specialInstructions && (
            <>
              <Separator className="mb-3" />
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-1">Instrucciones especiales:</h4>
                <p className="text-sm text-muted-foreground">{order.specialInstructions}</p>
              </div>
            </>
          )}
          
          {order.status === 'pending' && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isMarking}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marcar como servido
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Marcar pedido como servido?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que quieres marcar el pedido de {order.name} como servido? 
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleMarkAsServed}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}