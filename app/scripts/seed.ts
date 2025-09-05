// Seed script - disabled for deployment compatibility
// Data is now managed by the mock data system

console.log('Seed script disabled - using mock data system for deployment compatibility');
console.log('Mock data is automatically loaded from lib/mock-data.ts');

async function seedMain() {
  console.log('Demo data is available in lib/mock-data.ts');
  console.log('Seeding completed successfully (using mock data)');
}

seedMain()
  .then(async () => {
    console.log('Mock data system is ready');
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });