'use client';

import { useState, useTransition, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { debounce } from '@/lib/utils';

import { adjustIngredients } from '@/ai/flows/ingredient-adjustment';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type CoffeeSize, coffeeTypes } from '@/types';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  coffeeType: z.enum(coffeeTypes),
  size: z.enum(['Small', 'Medium', 'Large']),
  specialInstructions: z.string().optional(),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  onSubmit: (data: OrderFormValues & { aiSuggestion?: string }) => void;
}

export default function OrderForm({ onSubmit }: OrderFormProps) {
  const [isSubmitting, startTransition] = useTransition();
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isAISuggesting, setIsAISuggesting] = useState<boolean>(false);
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

  const debouncedAdjustIngredients = useCallback(
    debounce(async (instructions: string) => {
      if (instructions.trim().length > 10) {
        setIsAISuggesting(true);
        setAiSuggestion('');
        try {
          const result = await adjustIngredients({ orderDescription: instructions });
          setAiSuggestion(result.suggestedAdjustments);
        } catch (error) {
          console.error('AI suggestion failed:', error);
        } finally {
          setIsAISuggesting(false);
        }
      } else {
        setAiSuggestion('');
      }
    }, 1000),
    []
  );

  const handleSpecialInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    form.setValue('specialInstructions', value);
    debouncedAdjustIngredients(value);
  };

  const handleSubmit = (values: OrderFormValues) => {
    startTransition(() => {
      onSubmit({ ...values, aiSuggestion });
      form.reset();
      setAiSuggestion('');
      toast({
        title: "¡Pedido enviado!",
        description: "Tu café está en la cola. Revisa la hora de recogida.",
      });
    });
  };

  return (
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
                  onChange={handleSpecialInstructionsChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(isAISuggesting || aiSuggestion) && (
          <div className="p-3 rounded-md bg-accent/10 border border-accent/20">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-accent">
                <Wand2 className="w-4 h-4"/>
                Sugerencia de IA
            </h4>
            {isAISuggesting ? (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    Analizando tu petición...
                 </div>
            ) : (
                aiSuggestion && <p className="text-sm text-accent-foreground">{aiSuggestion}</p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Añadir a la cola
        </Button>
      </form>
    </Form>
  );
}
