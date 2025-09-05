
# 🚀 Guía de Despliegue Público para birdlogyc

## ⚠️ Situación Actual
El empaquetado automático está experimentando timeouts debido al tamaño de la aplicación (310MB). Sin embargo, la aplicación está completamente funcional y optimizada.

---

## 🎯 SOLUCIÓN RÁPIDA: Vercel (2-3 minutos)

### **Paso 1: Preparar el código**
```bash
# La aplicación ya está optimizada y lista
# Archivos principales en: /home/ubuntu/sales_visit_manager/app
```

### **Paso 2: Desplegar en Vercel**
1. **Ve a:** [vercel.com](https://vercel.com)
2. **Regístrate/Inicia sesión** con GitHub
3. **Import Project** → **Add GitHub Repo**
4. **Selecciona el framework:** Next.js (auto-detectado)
5. **Variables de entorno:**
   ```
   NEXTAUTH_SECRET=XLobDl3UG19igldLNxMozXZzRgsMgrWy
   DATABASE_URL=postgresql://postgres.olmzmsgfvosoadjrhmpkm:n5N92I2b9bGptsb@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
   ```
6. **Deploy** → ¡Listo en 2-3 minutos!

### **URL Resultante:**
```
https://birdlogyc-[tu-username].vercel.app
```

---

## 🔥 ALTERNATIVA INMEDIATA: Túnel Local

### **Opción A: ngrok (Más estable)**
```bash
# 1. Instalar ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# 2. Crear túnel (desde otra terminal)
cd /home/ubuntu/sales_visit_manager/app
yarn dev &
ngrok http 3000

# 3. URL pública inmediata:
# https://[random-id].ngrok.io
```

### **Opción B: Cloudflare Tunnel (Gratis)**
```bash
# 1. Descargar cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared

# 2. Crear túnel
cd /home/ubuntu/sales_visit_manager/app
yarn dev &
cloudflared tunnel --url http://localhost:3000

# 3. URL pública inmediata:
# https://[random-id].trycloudflare.com
```

---

## 🌐 OTRAS OPCIONES DE DEPLOY

### **Netlify (Drag & Drop)**
1. **Build local:** `yarn build && yarn export`
2. **Ve a:** [netlify.com](https://netlify.com)
3. **Drag & Drop** la carpeta `out/`
4. **URL:** `https://[random-name].netlify.app`

### **Railway (GitHub Integration)**
1. **Ve a:** [railway.app](https://railway.app)
2. **Deploy from GitHub** → Conecta repo
3. **Framework:** Next.js (auto-detectado)
4. **URL:** `https://[project-name].up.railway.app`

---

## ✅ Estado de la Aplicación

### **Completamente funcional:**
- ✅ **Autenticación demo** funcionando
- ✅ **Sales Manager Dashboard** completo
- ✅ **Todas las APIs** operativas  
- ✅ **Interfaz responsive** optimizada
- ✅ **Datos demo** integrados

### **Credenciales de acceso:**
- **Manager:** `pierre@birdlogyc.com` / `demo123`
- **Admin:** `manager@birdlogyc.com` / `demo123`  
- **Sales Rep:** `marie@birdlogyc.com` / `demo123`

---

## 🎯 RECOMENDACIÓN

**Para demostración inmediata:** Usa **ngrok** o **Cloudflare Tunnel**
**Para producción:** Usa **Vercel** (más profesional y permanente)

¡La aplicación birdlogyc está 100% lista para ser mostrada! 🚀
