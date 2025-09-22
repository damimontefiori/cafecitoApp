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

export type OrderStatus = 'pending' | 'served';

export interface Order {
  id: string;
  name: string;
  coffeeType: CoffeeType;
  size: CoffeeSize;
  specialInstructions?: string;
  pickupTime: Date;
  businessId: string;
  status: OrderStatus;
  createdAt: Date;
}

export interface OrderDocument {
  id: string;
  name: string;
  coffeeType: CoffeeType;
  size: CoffeeSize;
  specialInstructions?: string;
  pickupTime: Timestamp;
  businessId: string;
  status: OrderStatus;
  createdAt: Timestamp;
}

export interface Business {
  id: string;
  name: string;
  adminId: string;
  adminEmail: string;
  createdAt: Date;
  isActive: boolean;
}

export interface BusinessDocument {
  id: string;
  name: string;
  adminId: string;
  adminEmail: string;
  createdAt: Timestamp;
  isActive: boolean;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  businessId?: string;
}
