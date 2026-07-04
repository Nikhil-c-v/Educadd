const app = require('../app');

// Export app directly for Vercel serverless
module.exports = app;

// Also export as default for ES modules compatibility
module.exports.default = app;