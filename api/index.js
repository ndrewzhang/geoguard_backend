const app = require('../src/index');

// Vercel expects a function exported as module.exports
module.exports = (req, res) => {
  return app(req, res);
};
