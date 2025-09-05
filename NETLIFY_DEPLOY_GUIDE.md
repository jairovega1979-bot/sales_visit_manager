
# 🚀 Guía Completa de Despliegue en Netlify - birdlogyc

## 📋 **Método 1: Drag & Drop (Más Rápido - 3 minutos)**

### **Paso 1: Preparar el build**
```bash
cd /home/ubuntu/sales_visit_manager/app

# Instalar dependencias (si no están)
yarn install

# Crear build de producción
yarn build

# Crear carpeta de export estático
yarn next export
```

### **Paso 2: Desplegar en Netlify**
1. **Ve a:** [netlify.com](https://netlify.com)
2. **Regístrate/Inicia sesión** (GitHub, GitLab, o email)
3. **Busca:** "Drag and drop your site folder here"
4. **Arrastra la carpeta:** `out/` (creada en Paso 1)
5. **¡Listo!** URL automática: `https://[random-name].netlify.app`

### **Paso 3: Personalizar dominio**
1. **En tu dashboard Netlify:** Site settings → Domain management
2. **Change site name:** `birdlogyc` (si está disponible)
3. **URL final:** `https://birdlogyc.netlify.app`

---

## 📋 **Método 2: GitHub Integration (Recomendado)**

### **Paso 1: Configurar repositorio**
```bash
# Si no tienes repo, crear uno en GitHub con el código
# Asegúrate que esté sincronizado
```

### **Paso 2: Conectar con Netlify**
1. **Ve a:** [netlify.com](https://netlify.com)
2. **New site from Git** → **GitHub**
3. **Autorizar** acceso de Netlify a GitHub
4. **Selecciona** tu repositorio `birdlogyc` o `sales_visit_manager`

### **Paso 3: Configurar build**
```bash
# Build settings en Netlify:
Base directory: app
Build command: yarn build && yarn next export
Publish directory: app/out
```

### **Paso 4: Variables de entorno**
En **Site settings → Environment variables:**
```bash
NEXTAUTH_SECRET=XLobDl3UG19igldLNxMozXZzRgsMgrWy
DATABASE_URL=postgresql://postgres.olmzmsgfvosoadjrhmpkm:n5N92I2b9bGptsb@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
NODE_VERSION=18
```

### **Paso 5: Deploy**
1. **Deploy site** → Automático en 2-3 minutos
2. **URL:** `https://[site-name].netlify.app`

---

## ⚙️ **Configuración para Next.js (Importante)**

### **Archivo: `next.config.js`**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  }
}

module.exports = nextConfig
```

### **Archivo: `package.json` (scripts)**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next export",
    "build:netlify": "next build && next export",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🔧 **Configuraciones Adicionales**

### **Redirects (_redirects en carpeta public)**
```bash
# Archivo: public/_redirects
/*    /index.html   200

# Para SPA routing
/dashboard/*  /dashboard/index.html  200
/auth/*       /auth/index.html       200
```

### **Headers personalizados (opcional)**
```bash
# Archivo: public/_headers
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
```

---

## 🚀 **Deploy con Netlify CLI (Avanzado)**

### **Instalación**
```bash
npm install -g netlify-cli
netlify login
```

### **Deploy desde terminal**
```bash
cd /home/ubuntu/sales_visit_manager/app

# Build
yarn build && yarn export

# Deploy inicial
netlify deploy --dir=out --site=birdlogyc

# Deploy a producción
netlify deploy --prod --dir=out --site=birdlogyc
```

---

## 🔍 **Troubleshooting Común**

### **Error: "Page Not Found"**
**Solución:** Agregar archivo `_redirects`:
```bash
echo "/*    /index.html   200" > out/_redirects
```

### **Error: "Images not loading"**
**Solución:** En `next.config.js`:
```javascript
images: { unoptimized: true }
```

### **Error: "API Routes not working"**
**Solución:** Las API routes no funcionan en export estático. Usar:
- Serverless functions de Netlify
- O usar ISR (Incremental Static Regeneration)

### **Error de Build**
**Solución:** Verificar Node version:
```bash
# En Netlify: Environment variables
NODE_VERSION=18
```

---

## 📊 **Ventajas de Netlify**

### **✅ Funcionalidades incluidas:**
- 🚀 **Deploy automático** desde GitHub
- 🌐 **CDN global** integrado
- 🔒 **HTTPS automático** (SSL)
- 📈 **Analytics básico** gratis
- 🔄 **Preview deploys** para branches
- 🛠️ **Serverless functions** disponibles
- 💾 **Form handling** sin backend

### **💰 Precios:**
- **Starter (Gratis):** 100GB bandwidth, 300 build minutes
- **Pro ($19/mes):** 1TB bandwidth, builds ilimitados

---

## 🎯 **Resultado Final**

### **URL de tu aplicación:**
```
https://birdlogyc.netlify.app
```

### **Credenciales demo:**
- **Manager:** `pierre@birdlogyc.com` / `demo123`
- **Admin:** `manager@birdlogyc.com` / `demo123`
- **Sales Rep:** `marie@birdlogyc.com` / `demo123`

### **Funcionalidades disponibles:**
- ✅ Landing page profesional
- ✅ Autenticación demo completa
- ✅ Sales Manager Dashboard
- ✅ Gestión de clientes/ofertas
- ✅ Métricas y reportes
- ✅ Interfaz responsive optimizada

---

## 🚀 **Quick Start (Resumen)**

```bash
# 1. Build
cd /home/ubuntu/sales_visit_manager/app
yarn build && yarn export

# 2. Ve a netlify.com
# 3. Drag & drop carpeta 'out'
# 4. ¡Listo! URL disponible inmediatamente
```

**¡Tu aplicación birdlogyc estará online en menos de 5 minutos!** 🎉
