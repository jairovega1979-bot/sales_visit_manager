
const { execSync } = require('child_process');

console.log('🛡️ Activando prevención de core dumps...');

// Configurar variables de entorno para limitar memoria
process.env.NODE_OPTIONS = '--max-old-space-size=2048 --optimize-for-size';

// Deshabilitar core dumps
try {
  execSync('ulimit -c 0', { stdio: 'ignore' });
  console.log('✅ Core dumps deshabilitados');
} catch (error) {
  console.warn('⚠️ No se pudo deshabilitar core dumps:', error.message);
}

// Configurar handlers de error globales
process.on('uncaughtException', (error) => {
  console.error('🚨 Error no capturado:', error.message);
  
  // Limpiar antes de salir
  try {
    execSync('find /home/ubuntu -name "core*" -type f -delete 2>/dev/null', { stdio: 'ignore' });
  } catch (e) {
    // Ignorar errores de limpieza
  }
  
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Promesa rechazada:', reason);
});

// Monitoreo de memoria cada 60 segundos
setInterval(() => {
  const usage = process.memoryUsage();
  const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
  
  if (usedMB > 1800) {
    console.warn(`⚠️ Alto uso de memoria: ${usedMB}MB`);
    
    if (global.gc) {
      global.gc();
      console.log('🧹 Garbage collection ejecutado');
    }
  }
}, 60000);

console.log('🟢 Sistema de prevención activado');
