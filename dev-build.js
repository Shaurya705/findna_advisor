const { execSync } = require('child_process');
const fs = require('fs');

// Display startup message
console.log('Starting build process for findna-advisor...');

// Install dependencies if node_modules doesn't exist
try {
  if (!fs.existsSync('./node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

// Clean development cache
try {
  console.log('Cleaning Vite cache...');
  if (fs.existsSync('./node_modules/.vite')) {
    fs.rmSync('./node_modules/.vite', { recursive: true, force: true });
  }
} catch (error) {
  console.log('No Vite cache to clean or error cleaning cache');
}

// Start development server
try {
  console.log('Starting development server...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting development server:', error);
  process.exit(1);
}
