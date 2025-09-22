import { Timestamp } from 'firebase/firestore';

export type CoffeeSize = "Small" | "Medium" | "Large";

export const coffeeTypes = [
  'Espresso',
  'Latte',
  'Cappuccino',
  'Americano',
  'Macchiato',
  'Mocha',
] as const;

export type CoffeeType = (typeof coffeeTypes)[number];

export interface Order {
  id: string;
  name: string;
  coffeeType: CoffeeType;
  size: CoffeeSize;
  specialInstructions?: string;
  pickupTime: Date;
}

export interface OrderDocument {
  id: string;
  name: string;
  coffeeType: CoffeeType;
  size: CoffeeSize;
  specialInstructions?: string;
  pickupTime: Timestamp;
}
