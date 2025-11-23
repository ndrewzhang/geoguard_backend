const express = require('express');
const router = express.Router();
const { listItems } = require('../controllers/itemsController');
const { listInfo } = require('../controllers/infoController');

// Simple health check
router.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Example resource route — uses service to fetch data
router.get('/items', listItems);
// Updated to accept an optional `url` query parameter: /info?url=https://example.com
router.get('/info', listInfo);

asdasd

module.exports = router;
