import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Business, BusinessDocument } from '@/types';

export async function createBusiness(businessData: {
  name: string;
  adminId: string;
  adminEmail: string;
}): Promise<Business> {
  const businessCol = collection(db, 'businesses');
  const docRef = await addDoc(businessCol, {
    ...businessData,
    createdAt: Timestamp.fromDate(new Date()),
    isActive: true,
  });

  return {
    id: docRef.id,
    ...businessData,
    createdAt: new Date(),
    isActive: true,
  };
}

export async function getBusinessByAdminId(adminId: string): Promise<Business | null> {
  const businessCol = collection(db, 'businesses');
  const q = query(businessCol, where('adminId', '==', adminId));
  const businessSnapshot = await getDocs(q);
  
  if (businessSnapshot.empty) {
    return null;
  }

  const doc = businessSnapshot.docs[0];
  const data = doc.data() as BusinessDocument;
  
  return {
    id: doc.id,
    name: data.name,
    adminId: data.adminId,
    adminEmail: data.adminEmail,
    createdAt: data.createdAt.toDate(),
    isActive: data.isActive,
  };
}

export async function getBusinessById(businessId: string): Promise<Business | null> {
  const businessDoc = doc(db, 'businesses', businessId);
  const businessSnapshot = await getDoc(businessDoc);
  
  if (!businessSnapshot.exists()) {
    return null;
  }

  const data = businessSnapshot.data() as BusinessDocument;
  
  return {
    id: businessSnapshot.id,
    name: data.name,
    adminId: data.adminId,
    adminEmail: data.adminEmail,
    createdAt: data.createdAt.toDate(),
    isActive: data.isActive,
  };
}

export async function getAllBusinesses(): Promise<Business[]> {
  const businessCol = collection(db, 'businesses');
  const q = query(businessCol, where('isActive', '==', true), orderBy('createdAt', 'desc'));
  const businessSnapshot = await getDocs(q);

  return businessSnapshot.docs.map(doc => {
    const data = doc.data() as BusinessDocument;
    return {
      id: doc.id,
      name: data.name,
      adminId: data.adminId,
      adminEmail: data.adminEmail,
      createdAt: data.createdAt.toDate(),
      isActive: data.isActive,
    };
  });
}