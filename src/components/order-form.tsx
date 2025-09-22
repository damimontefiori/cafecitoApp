'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isWithinBusinessHours, getBusinessHoursMessage } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type CoffeeSize, coffeeTypes } from '@/types';
import { Loader2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  coffeeType: z.enum(coffeeTypes),
  size: z.enum(['Small', 'Medium', 'Large']),
  specialInstructions: z.string().optional(),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  onSubmit: (data: OrderFormValues) => void;
}

export default function OrderForm({ onSubmit }: OrderFormProps) {
  const [isSubmitting, startTransition] = useTransition();
  const [isBusinessHours, setIsBusinessHours] = useState(true);
  const { toast } = useToast();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      coffeeType: 'Latte',
      size: 'Medium',
      specialInstructions: '',
    },
  });

  useEffect(() => {
    const checkBusinessHours = () => {
      setIsBusinessHours(isWithinBusinessHours());
    };
    
    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (values: OrderFormValues) => {
    if (!isBusinessHours) {
      toast({
        title: "Fuera de horario",
        description: "Solo aceptamos pedidos de 9:00 a 17:00 horas.",
        variant: "destructive",
      });
      return;
    }

    startTransition(() => {
      onSubmit(values);
      form.reset();
      toast({
        title: "¡Pedido enviado!",
        description: "Tu café está en la cola. Revisa la hora de recogida.",
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Business Hours Alert */}
      <div className={`p-4 rounded-lg border flex items-center gap-3 ${
        isBusinessHours 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <Clock className="w-5 h-5" />
        <div>
          <p className="font-medium">
            {isBusinessHours ? '¡Estamos abiertos!' : 'Cerrado'}
          </p>
          <p className="text-sm">
            {getBusinessHoursMessage()}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tu nombre</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coffeeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de café</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de café" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {coffeeTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tamaño</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  {(['Small', 'Medium', 'Large'] as CoffeeSize[]).map((size) => (
                    <FormItem key={size} className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={size} />
                      </FormControl>
                      <FormLabel className="font-normal">{size}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instrucciones especiales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ej: shot extra, leche de avena, menos azúcar..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting || !isBusinessHours}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isBusinessHours ? 'Añadir a la cola' : 'Cerrado - No disponible'}
        </Button>
        </form>
      </Form>
    </div>
  );
}
