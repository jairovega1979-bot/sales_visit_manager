
# 🚀 Guía SIMPLIFICADA de Despliegue en Netlify - birdlogyc

## ⚠️ **Nota Importante**
La aplicación birdlogyc incluye API routes que no son compatibles con export estático. Te proporciono 2 opciones:

---

## 📋 **OPCIÓN 1: Deploy con Vercel (RECOMENDADO)**

Vercel maneja mejor las API routes de Next.js:

### **Pasos rápidos:**
1. **Ve a:** [vercel.com](https://vercel.com)
2. **Conecta GitHub** e importa tu repositorio
3. **Variables de entorno:**
   ```bash
   NEXTAUTH_SECRET=XLobDl3UG19igldLNxMozXZzRgsMgrWy
   DATABASE_URL=postgresql://postgres.olmzmsgfvosoadjrhmpkm:n5N92I2b9bGptsb@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
   ```
4. **Deploy automático** → URL: `https://birdlogyc.vercel.app`

---

## 📋 **OPCIÓN 2: Netlify con Serverless Functions**

### **Paso 1: Preparar proyecto**
```bash
cd /home/ubuntu/sales_visit_manager/app

# Crear versión simplificada para Netlify
cp -r . ../app-netlify
cd ../app-netlify
```

### **Paso 2: Configurar para Netlify**
Crear archivo `netlify/functions/api.js`:
```javascript
const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

// Ruta básica para demo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'birdlogyc API running' });
});

// Exportar como función serverless
module.exports.handler = serverless(app);
```

### **Paso 3: Actualizar next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  swcMinify: false,
  reactStrictMode: false,
  // Redirect APIs to Netlify functions
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/.netlify/functions/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### **Paso 4: Deploy**
1. **Ve a:** [netlify.com](https://netlify.com)
2. **Drag & Drop** la carpeta del proyecto
3. **Build settings:**
   - Build command: `npm run build && npm run export`
   - Publish directory: `out`

---

## 📋 **OPCIÓN 3: Demo Estático (Solo Frontend)**

Si solo quieres mostrar la interfaz:

### **Preparar build estático:**
```bash
cd /home/ubuntu/sales_visit_manager/app

# Remover temporalmente las API routes
mkdir api-backup
mv app/api/* api-backup/

# Configurar para export estático
export NETLIFY=true
yarn build
yarn export
```

### **Deploy en Netlify:**
1. **Ve a:** [netlify.com](https://netlify.com)
2. **Arrastra carpeta** `out/` 
3. **¡Listo!** - Solo funcionalidad frontend

---

## 🎯 **Recomendación Final**

### **Para aplicación COMPLETA (con APIs):**
**→ Usa VERCEL** - Maneja automáticamente las API routes

### **Para DEMO de interfaz únicamente:**
**→ Usa NETLIFY** con Opción 3

---

## ✅ **Credenciales Demo (cualquier opción):**
- **Manager:** `pierre@birdlogyc.com` / `demo123`
- **Admin:** `manager@birdlogyc.com` / `demo123`
- **Sales Rep:** `marie@birdlogyc.com` / `demo123`

---

## 🚀 **URL Resultado:**

### **Vercel (Recomendado):**
```
https://birdlogyc.vercel.app
```

### **Netlify (Solo UI):**
```
https://birdlogyc.netlify.app
```

**¡Ambas opciones te darán una URL pública profesional!** 🎉
