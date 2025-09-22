'use server';

import { db } from '@/lib/firebase';
import { Order, CoffeeType, CoffeeSize } from '@/types';
import { collection, addDoc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';

export async function getOrders(): Promise<Order[]> {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, orderBy('pickupTime', 'desc'));
  const orderSnapshot = await getDocs(q);
  const orderList = orderSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      pickupTime: (data.pickupTime as Timestamp).toDate(),
    } as Order;
  });
  return orderList;
}

export async function addOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const ordersCol = collection(db, 'orders');
    const docRef = await addDoc(ordersCol, {
        ...order,
        specialInstructions: order.specialInstructions || '',
        pickupTime: Timestamp.fromDate(order.pickupTime),
    });
    return {
        id: docRef.id,
        ...order,
    };
}
