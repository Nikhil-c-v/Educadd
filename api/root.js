import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const indexPath = path.join(process.cwd(), 'frontend', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    
    const apiUrl = 'https://educadd-kqah.onrender.com';
    
    // Ensure the meta tag with correct API URL is in the HTML
    if (!html.includes(apiUrl)) {
      // Replace any existing educadd-api-url meta tag or add a new one
      if (html.includes('educadd-api-url')) {
        html = html.replace(
          /meta name="educadd-api-url"[^>]*content="[^"]*"/,
          `meta name="educadd-api-url" content="${apiUrl}"`
        );
      } else {
        // Add meta tag if it doesn't exist
        html = html.replace(
          '</head>',
          `  <meta name="educadd-api-url" content="${apiUrl}"/>\n</head>`
        );
      }
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
