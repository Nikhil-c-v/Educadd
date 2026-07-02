// Vercel build script - inject API URL into frontend files before deployment
const fs = require('fs');
const path = require('path');

// The build injection should only run when an explicit backend URL is provided via env var.
// This avoids forcing a remote API host on same-origin deployments.
const API_URL = process.env.BUILD_BACKEND_URL || '';

if (!API_URL) {
  console.log('No BUILD_BACKEND_URL provided — skipping API URL injection.');
  process.exit(0);
}

console.log('Injecting API URL into frontend files...');

// Update site-config.js (only when API_URL is set)
const configPath = path.join(__dirname, 'frontend', 'site-config.js');
let configContent = fs.readFileSync(configPath, 'utf8');
configContent = configContent.replace(/const staticValue = '[^']*'/, `const staticValue = '${API_URL}'`);
fs.writeFileSync(configPath, configContent);
console.log('✓ Updated site-config.js');

// Update index.html
const indexPath = path.join(__dirname, 'frontend', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes(`content="${API_URL}"`)) {
  indexContent = indexContent.replace(/<head[^>]*>/, `<head>\n  <meta name="educadd-api-url" content="${API_URL}"/>`);
}
fs.writeFileSync(indexPath, indexContent);
console.log('✓ Updated index.html');

// Update admin.html
const adminPath = path.join(__dirname, 'frontend', 'admin.html');
let adminContent = fs.readFileSync(adminPath, 'utf8');
if (!adminContent.includes(`content="${API_URL}"`)) {
  adminContent = adminContent.replace(/<head[^>]*>/, `<head>\n  <meta name="educadd-api-url" content="${API_URL}"/>`);
}
fs.writeFileSync(adminPath, adminContent);
console.log('✓ Updated admin.html');

console.log('✓ API URL injection complete!');
