
#!/bin/bash

echo "🔧 Configurando límites de core dumps y optimizando estabilidad..."

# Configurar límites de core dumps en el sistema
ulimit -c 0  # Deshabilitar core dumps completamente

# Limpiar archivos core existentes si los hay
echo "🧹 Limpiando archivos core existentes..."
find /home/ubuntu/sales_visit_manager -name "core*" -type f -exec rm -f {} \;
find /home/ubuntu -name "core*" -type f -exec rm -f {} \; 2>/dev/null || true

# Limpiar logs antiguos (mantener solo los últimos 50)
echo "📋 Limpiando logs antiguos..."
cd /home/ubuntu/sales_visit_manager/.logs
if [ "$(ls -1 | wc -l)" -gt 50 ]; then
    ls -1t | tail -n +51 | xargs rm -f
fi

# Optimizar configuración de Node.js
echo "⚙️ Configurando variables de entorno para Node.js..."
export NODE_OPTIONS="--max-old-space-size=2048 --optimize-for-size"

# Verificar espacio en disco
echo "💾 Verificando espacio en disco..."
df -h /home/ubuntu

echo "✅ Configuración completada!"
echo "📊 Tamaño actual del proyecto:"
du -sh /home/ubuntu/sales_visit_manager
