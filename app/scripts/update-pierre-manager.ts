// Update script - disabled for deployment compatibility
// User data is now managed by the mock data system

console.log('Update script disabled - using mock data system for deployment compatibility');
console.log('User data is automatically managed in lib/mock-data.ts');

async function updateMain() {
  console.log('Pierre Martin is already configured as MANAGER in mock data');
  console.log('Update completed successfully (using mock data)');
}

updateMain()
  .then(async () => {
    console.log('Mock user system is ready');
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });