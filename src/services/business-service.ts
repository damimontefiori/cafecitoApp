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
  console.log('🔍 [getBusinessById] Buscando negocio con ID:', businessId);
  
  try {
    const businessDoc = doc(db, 'businesses', businessId);
    console.log('📄 [getBusinessById] Referencia de documento creada');
    
    const businessSnapshot = await getDoc(businessDoc);
    console.log('📥 [getBusinessById] Snapshot obtenido, existe:', businessSnapshot.exists());
    
    if (!businessSnapshot.exists()) {
      console.log('❌ [getBusinessById] Negocio no existe en Firestore');
      return null;
    }

    const data = businessSnapshot.data() as BusinessDocument;
    console.log('📊 [getBusinessById] Datos del negocio:', { 
      id: businessSnapshot.id,
      name: data.name,
      adminId: data.adminId,
      hasCreatedAt: !!data.createdAt 
    });
    
    const business = {
      id: businessSnapshot.id,
      name: data.name,
      adminId: data.adminId,
      adminEmail: data.adminEmail,
      createdAt: data.createdAt.toDate(),
      isActive: data.isActive,
    };
    
    console.log('✅ [getBusinessById] Negocio cargado exitosamente:', business.name);
    return business;
  } catch (error) {
    console.error('🚨 [getBusinessById] Error al cargar negocio:', error);
    throw error;
  }
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