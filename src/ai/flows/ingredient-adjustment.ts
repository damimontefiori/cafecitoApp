// ingredient-adjustment.ts
'use server';

/**
 * @fileOverview Adjusts ingredients for unusual coffee orders using AI.
 *
 * - adjustIngredients - A function that suggests ingredient adjustments for a given coffee order.
 * - AdjustIngredientsInput - The input type for the adjustIngredients function.
 * - AdjustIngredientsOutput - The return type for the adjustIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustIngredientsInputSchema = z.object({
  orderDescription: z
    .string()
    .describe('The description of the coffee order, including details about the coffee type, size, and any special instructions.'),
});
export type AdjustIngredientsInput = z.infer<typeof AdjustIngredientsInputSchema>;

const AdjustIngredientsOutputSchema = z.object({
  suggestedAdjustments: z
    .string()
    .describe('The suggested ingredient adjustments for the coffee order.'),
});
export type AdjustIngredientsOutput = z.infer<typeof AdjustIngredientsOutputSchema>;

export async function adjustIngredients(input: AdjustIngredientsInput): Promise<AdjustIngredientsOutput> {
  return adjustIngredientsFlow(input);
}

const adjustIngredientsPrompt = ai.definePrompt({
  name: 'adjustIngredientsPrompt',
  input: {schema: AdjustIngredientsInputSchema},
  output: {schema: AdjustIngredientsOutputSchema},
  prompt: `You are an experienced barista. A customer has placed the following order:

"""
{{{orderDescription}}}
"""

Suggest any necessary ingredient adjustments to efficiently fulfill this order while maintaining quality. Consider non-standard requests or ingredient combinations.
`,
});

const adjustIngredientsFlow = ai.defineFlow(
  {
    name: 'adjustIngredientsFlow',
    inputSchema: AdjustIngredientsInputSchema,
    outputSchema: AdjustIngredientsOutputSchema,
  },
  async input => {
    const {output} = await adjustIngredientsPrompt(input);
    return output!;
  }
);
