'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getBusinessByAdminId } from '@/services/business-service';

export default function AdminPage() {
  const [user, loading, error] = useAuthState(auth);
  const [checkingBusiness, setCheckingBusiness] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // No está autenticado, redirigir a registro
      router.push('/admin/register');
      return;
    }

    // Usuario autenticado, verificar si ya tiene un negocio
    const checkBusiness = async () => {
      setCheckingBusiness(true);
      try {
        const business = await getBusinessByAdminId(user.uid);
        if (business) {
          // Ya tiene negocio, redirigir a su panel
          router.push(`/admin/${business.id}`);
        } else {
          // No tiene negocio, redirigir a registro
          router.push('/admin/register');
        }
      } catch (error) {
        console.error('Error checking business:', error);
        router.push('/admin/register');
      } finally {
        setCheckingBusiness(false);
      }
    };

    checkBusiness();
  }, [user, loading, router]);

  if (loading || checkingBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Verificando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error.message}</p>
          <button 
            onClick={() => router.push('/admin/register')}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Ir a Registro
          </button>
        </div>
      </div>
    );
  }

  return null; // Este componente solo redirige, no renderiza nada
}