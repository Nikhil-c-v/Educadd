// Vercel serverless function to serve index.html with injected API URL
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'frontend', 'index.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    const apiUrl = 'https://educadd-kqah.onrender.com';
    
    // Force inject the API URL into the HTML
    content = content.replace(
      /meta name="educadd-api-url" content="[^"]*"/g,
      `meta name="educadd-api-url" content="${apiUrl}"`
    );
    
    // If meta tag doesn't exist, add it
    if (!content.includes('educadd-api-url')) {
      content = content.replace(
        '<head>',
        `<head>\n  <meta name="educadd-api-url" content="${apiUrl}"/>`
      );
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    res.status(200).send(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
