# 🔄 Migración de Dominio: tiny-sprinkles-120341.netlify.app → lattehub.netlify.app

## 📋 **Checklist de Cambios Necesarios**

### 🔥 **1. Firebase Console (CRÍTICO)**
**URL**: https://console.firebase.google.com/
**Proyecto**: `studio-281573522-77e6b`

#### Pasos obligatorios:
1. Ve a **Authentication** → **Settings** → **Authorized domains**
2. **Añadir**: `lattehub.netlify.app`
3. **Opcional**: Remover `tiny-sprinkles-120341.netlify.app` (si ya no se usa)

### 🔐 **2. Google Cloud Console (CRÍTICO)**
**URL**: https://console.cloud.google.com/
**Proyecto**: `studio-281573522-77e6b`

#### Pasos obligatorios:
1. Ve a **APIs & Services** → **Credentials**
2. Busca la **OAuth 2.0 Client ID** (que termina en `.apps.googleusercontent.com`)
3. Haz clic para editar
4. En **Authorized JavaScript origins**, añadir:
   - `https://lattehub.netlify.app`
5. En **Authorized redirect URIs**, añadir:
   - `https://lattehub.netlify.app/__/auth/handler`
6. **Guardar cambios**

### 🌐 **3. Netlify (YA HECHO)**
✅ Has configurado el dominio personalizado `lattehub.netlify.app`
✅ El código se desplegará automáticamente al nuevo dominio

## 🚨 **¿Por qué estos cambios son necesarios?**

### Sin estos cambios obtendrás estos errores:
- ❌ **Firebase**: "auth/unauthorized-domain"
- ❌ **Google OAuth**: "redirect_uri_mismatch"
- ❌ **Resultado**: La autenticación fallará completamente

## ✅ **Código - No requiere cambios**

### ¿Por qué el código no necesita cambios?
- ✅ **Firebase config**: Usa variables relativas, no dominios hardcodeados
- ✅ **OAuth redirects**: Firebase maneja automáticamente el dominio actual
- ✅ **API calls**: Todo es relativo al dominio actual
- ✅ **Rutas**: Next.js maneja las rutas dinámicamente

## 🧪 **Testing después de los cambios**

### Flujo de prueba:
1. Ve a: `https://lattehub.netlify.app/admin/register`
2. Haz clic en "Continuar con Google"
3. **Esperado**: Login de Google exitoso
4. **Si falla**: Revisa los pasos de Firebase/Google Cloud

### URLs actualizadas:
- **Admin**: `https://lattehub.netlify.app/admin/register`
- **Cliente**: `https://lattehub.netlify.app/business/[businessId]`
- **Business ID actual**: `TYrHY4FDULgHnAjx7ARe`

## 📞 **Soporte**

### Si algo no funciona después de hacer estos cambios:
1. Revisa la consola del navegador (F12) para ver logs detallados
2. Verifica que ambos pasos (Firebase + Google Cloud) estén completos
3. Puede tomar unos minutos en propagarse

### Logs útiles a buscar:
- 🔍 `[getBusinessById]` - Carga de negocio
- 👤 `[AdminPanel]` - Flujo de autenticación admin
- 📦 `[getOrdersByBusinessId]` - Carga de pedidos

---

**⏰ Estado actual**: El código está listo, solo faltan las configuraciones de autenticación en Firebase/Google Cloud.