
// Configuración de estabilidad para prevenir core dumps
export const setupStabilityMonitoring = () => {
  if (typeof window !== 'undefined') {
    // Solo en el cliente
    return;
  }

  // Configurar límites de memoria para Node.js
  process.setMaxListeners(50);

  // Manejar errores no capturados
  process.on('uncaughtException', (error) => {
    console.error('🚨 Error no capturado:', error);
    // Log el error pero no terminar el proceso inmediatamente
    setTimeout(() => {
      console.log('🔄 Reiniciando gracefully...');
      process.exit(1);
    }, 1000);
  });

  // Manejar promesas rechazadas
  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Promesa rechazada:', reason);
    console.error('🔍 En promesa:', promise);
  });

  // Monitorear uso de memoria
  const monitorMemory = () => {
    const usage = process.memoryUsage();
    const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
    const totalMB = Math.round(usage.heapTotal / 1024 / 1024);
    
    if (usedMB > 1500) { // Si usa más de 1.5GB
      console.warn(`⚠️ Alto uso de memoria: ${usedMB}MB / ${totalMB}MB`);
      
      if (global.gc) {
        console.log('🧹 Ejecutando garbage collection...');
        global.gc();
      }
    }
  };

  // Verificar memoria cada 30 segundos
  setInterval(monitorMemory, 30000);

  console.log('✅ Monitoreo de estabilidad activado');
};

// Configuración de límites de core dumps
export const disableCoreDumps = () => {
  try {
    // Deshabilitar core dumps
    const { execSync } = require('child_process');
    execSync('ulimit -c 0', { stdio: 'ignore' });
  } catch (error) {
    console.warn('No se pudo configurar ulimit:', error instanceof Error ? error.message : 'Error desconocido');
  }
};
