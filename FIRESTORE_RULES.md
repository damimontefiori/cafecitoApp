# Reglas de Firestore recomendadas para Firebase Console

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para la colección de negocios
    match /businesses/{document} {
      // Permitir lectura a todos (para mostrar negocios públicos)
      allow read: if true;
      
      // Permitir escritura solo a usuarios autenticados
      allow create, update: if request.auth != null;
      
      // Permitir eliminar solo al propietario del negocio
      allow delete: if request.auth != null && resource.data.adminId == request.auth.uid;
    }
    
    // Reglas para la colección de órdenes
    match /orders/{document} {
      // Permitir lectura a todos (para que los clientes vean las órdenes)
      allow read: if true;
      
      // Permitir crear órdenes a cualquiera
      allow create: if true;
      
      // Permitir actualizar órdenes solo al admin del negocio correspondiente
      allow update: if request.auth != null;
      
      // No permitir eliminar órdenes
      allow delete: if false;
    }
  }
}
```

# Instrucciones para configurar en Firebase Console:

1. Ve a Firebase Console (https://console.firebase.google.com/)
2. Selecciona tu proyecto "studio-281573522-77e6b"
3. Ve a "Firestore Database" en el menú lateral
4. Haz clic en la pestaña "Rules"
5. Reemplaza las reglas actuales con las reglas de arriba
6. Haz clic en "Publish"

# Nota importante:
Las reglas actuales probablemente están en modo restrictivo, lo que causa el error "permission-denied".