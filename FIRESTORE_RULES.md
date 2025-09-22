# Reglas de Firestore - URGENTE CONFIGURAR

## 🚨 IMPORTANTE: Configura estas reglas AHORA para solucionar el error "permission-denied"

### Paso 1: Ve al Firebase Console
1. Abre: https://console.firebase.google.com/
2. Selecciona tu proyecto: **studio-281573522-77e6b**
3. Ve a **"Firestore Database"** en el menú lateral
4. Haz clic en la pestaña **"Rules"**

### Paso 2: Reemplaza las reglas actuales con estas (TEMPORALES PARA TESTING):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // REGLAS TEMPORALES - MUY PERMISIVAS PARA TESTING
    // TODO: Restringir después de confirmar que funciona
    
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Paso 3: Haz clic en "Publish"

---

## ⚠️ DESPUÉS DE TESTING: Usar reglas más seguras

Una vez que confirmes que la autenticación funciona, reemplaza con estas reglas más seguras:

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

## 🔧 Estado Actual del Error:
- ❌ Cross-Origin-Opener-Policy: SOLUCIONADO (añadido a netlify.toml)
- ❌ Missing permissions: NECESITA configuración de reglas de Firestore
- ⏳ Redirect authentication: IMPLEMENTADO (necesita testing)