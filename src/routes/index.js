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
router.get('/info', listInfo);

module.exports = router;
