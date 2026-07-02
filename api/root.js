// Vercel serverless function to serve index.html with injected API URL
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'frontend', 'index.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Determine API URL dynamically: prefer BACKEND_URL env var, otherwise use request origin
    const apiUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

    // Inject (or replace) the meta tag so the frontend can discover the API base when served
    if (/meta name="educadd-api-url"/i.test(content)) {
      content = content.replace(/meta name="educadd-api-url" content="[^"]*"/gi, `meta name="educadd-api-url" content="${apiUrl}"`);
    } else {
      // Try to insert after the opening <head> tag (match with attributes as well)
      content = content.replace(/<head( [^>]*)?>/i, (m) => `${m}\n  <meta name="educadd-api-url" content="${apiUrl}"/>`);
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
