'use client';

import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAuth() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    setResult('Intentando autenticación...');
    
    try {
      console.log('Auth config:', {
        apiKey: auth.app.options.apiKey,
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId
      });

      console.log('Current URL:', window.location.origin);
      console.log('Attempting sign in...');

      const result = await signInWithPopup(auth, googleProvider);
      console.log('Auth success:', result);
      
      setResult(`✅ Éxito! Usuario: ${result.user.email}\nUID: ${result.user.uid}`);
    } catch (error: any) {
      console.error('Auth error details:', error);
      
      let errorDetails = `❌ Error Code: ${error.code || 'unknown'}\n`;
      errorDetails += `Message: ${error.message || 'No message'}\n`;
      errorDetails += `Current Origin: ${window.location.origin}\n`;
      errorDetails += `Auth Domain: ${auth.app.options.authDomain}\n`;
      
      if (error.customData) {
        errorDetails += `Custom Data: ${JSON.stringify(error.customData, null, 2)}\n`;
      }
      
      setResult(errorDetails);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Firebase Auth</CardTitle>
          <CardDescription>Prueba la configuración de autenticación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAuth} disabled={loading} className="w-full">
            {loading ? 'Probando...' : 'Probar Google Auth'}
          </Button>
          
          {result && (
            <div className="p-3 rounded bg-muted text-sm">
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            <p><strong>Auth Domain:</strong> {auth.app.options.authDomain}</p>
            <p><strong>Project ID:</strong> {auth.app.options.projectId}</p>
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}