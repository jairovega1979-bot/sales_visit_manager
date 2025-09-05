
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Monitor de salud del sistema - BirdlogyC');

// Función para verificar memoria
function checkMemory() {
  try {
    const memInfo = execSync('free -h', { encoding: 'utf-8' });
    console.log('💾 Estado de memoria:');
    console.log(memInfo);
  } catch (error) {
    console.error('Error al verificar memoria:', error.message);
  }
}

// Función para verificar procesos Node.js
function checkNodeProcesses() {
  try {
    const processes = execSync('ps aux | grep node | grep -v grep', { encoding: 'utf-8' });
    console.log('⚡ Procesos Node.js activos:');
    console.log(processes || 'Ningún proceso Node.js activo');
  } catch (error) {
    console.log('⚡ No hay procesos Node.js activos o error al verificar');
  }
}

// Función para verificar archivos core
function checkCoreFiles() {
  try {
    const coreFiles = execSync('find /home/ubuntu -name "core*" -type f 2>/dev/null', { encoding: 'utf-8' });
    if (coreFiles.trim()) {
      console.log('⚠️ Archivos core encontrados:');
      console.log(coreFiles);
      return true;
    } else {
      console.log('✅ No se encontraron archivos core');
      return false;
    }
  } catch (error) {
    console.log('✅ No se encontraron archivos core');
    return false;
  }
}

// Función para verificar tamaño del proyecto
function checkProjectSize() {
  try {
    const projectSize = execSync('du -sh /home/ubuntu/sales_visit_manager', { encoding: 'utf-8' });
    console.log('📁 Tamaño del proyecto:');
    console.log(projectSize);
  } catch (error) {
    console.error('Error al verificar tamaño:', error.message);
  }
}

// Función principal
function runHealthCheck() {
  console.log(`\n📅 ${new Date().toISOString()}`);
  console.log('═'.repeat(50));
  
  checkMemory();
  console.log('\n' + '─'.repeat(30));
  
  checkNodeProcesses();
  console.log('\n' + '─'.repeat(30));
  
  const hasCoreFiles = checkCoreFiles();
  console.log('\n' + '─'.repeat(30));
  
  checkProjectSize();
  
  if (hasCoreFiles) {
    console.log('\n🚨 ALERTA: Se encontraron archivos core. Ejecutar cleanup...');
  } else {
    console.log('\n🟢 Sistema saludable');
  }
  
  console.log('═'.repeat(50));
}

// Ejecutar verificación
runHealthCheck();

// Si se ejecuta con --watch, monitorear continuamente
if (process.argv.includes('--watch')) {
  console.log('👁️ Iniciando monitoreo continuo (cada 5 minutos)...');
  setInterval(runHealthCheck, 5 * 60 * 1000);
}
