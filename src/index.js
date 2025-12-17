require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => res.json({ ok: true, message: 'GeoGuard API' }));

// Support legacy/root requests by redirecting to the mounted /api routes.
// This preserves any query string so requests like /info?url=... still work.
app.get('/info', (req, res) => {
    console.log('Root /info handler invoked, original url:', req.url);
    const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    res.redirect(302, `/api/info${qs}`);
});

// Error handler (should be last)
app.use(errorHandler);

// Export app for serverless platforms (Vercel) and tests
module.exports = app;

// Start the server only when this file is run directly (node src/index.js)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

    // Demo: resolve an example host to IP (non-blocking)
    const { resolveUrlToIp } = require('./utils/helper');
    resolveUrlToIp('example.com')
        .then(ip => console.log(`example.com -> ${ip}`))
        .catch(() => {/* ignore in demo */});
}
