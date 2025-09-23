'use server';

import { db } from '@/lib/firebase';
import { Order, OrderDocument } from '@/types';
import { collection, addDoc, getDocs, orderBy, query, where, Timestamp, doc, updateDoc } from 'firebase/firestore';

export async function getOrders(): Promise<Order[]> {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, orderBy('createdAt', 'desc'));
  const orderSnapshot = await getDocs(q);

  return orderSnapshot.docs.map(doc => {
    const data = doc.data() as OrderDocument;
    return {
      id: doc.id,
      name: data.name,
      coffeeType: data.coffeeType,
      size: data.size,
      specialInstructions: data.specialInstructions || '',
      pickupTime: data.pickupTime.toDate(),
      businessId: data.businessId,
      status: data.status,
      createdAt: data.createdAt.toDate(),
    };
  });
}

export async function getOrdersByBusinessId(businessId: string): Promise<Order[]> {
  console.log('🔍 [getOrdersByBusinessId] Buscando pedidos para negocio:', businessId);
  
  try {
    const ordersCol = collection(db, 'orders');
    console.log('📄 [getOrdersByBusinessId] Colección de pedidos obtenida');
    
    const q = query(
      ordersCol, 
      where('businessId', '==', businessId),
      orderBy('createdAt', 'desc')
    );
    console.log('🔍 [getOrdersByBusinessId] Query creada');
    
    const orderSnapshot = await getDocs(q);
    console.log('📥 [getOrdersByBusinessId] Snapshot obtenido, cantidad de docs:', orderSnapshot.docs.length);

    const orders = orderSnapshot.docs.map(doc => {
      const data = doc.data() as OrderDocument;
      console.log('📊 [getOrdersByBusinessId] Procesando pedido:', { 
        id: doc.id, 
        name: data.name,
        status: data.status,
        hasCreatedAt: !!data.createdAt
      });
      
      return {
        id: doc.id,
        name: data.name,
        coffeeType: data.coffeeType,
        size: data.size,
        specialInstructions: data.specialInstructions || '',
        pickupTime: data.pickupTime.toDate(),
        businessId: data.businessId,
        status: data.status,
        createdAt: data.createdAt.toDate(),
      };
    });

    console.log('✅ [getOrdersByBusinessId] Pedidos cargados exitosamente:', orders.length);
    return orders;
  } catch (error) {
    console.error('🚨 [getOrdersByBusinessId] Error al cargar pedidos:', error);
    throw error;
  }
}

export async function addOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const ordersCol = collection(db, 'orders');
    const docRef = await addDoc(ordersCol, {
        ...order,
        specialInstructions: order.specialInstructions || '',
        pickupTime: Timestamp.fromDate(order.pickupTime),
        createdAt: Timestamp.fromDate(new Date()),
    });
    return {
        id: docRef.id,
        ...order,
        createdAt: new Date(),
    };
}

export async function markOrderAsServed(orderId: string): Promise<void> {
  const orderDoc = doc(db, 'orders', orderId);
  await updateDoc(orderDoc, {
    status: 'served'
  });
}
