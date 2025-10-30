const { getInfo } = require('../services/infoService');

// Controller for listing items
async function listInfo(req, res, next) {
  try {
    const items = await getInfo();
    res.json({ ok: true, data: items });
  } catch (err) {
    next(err);
  }
}

module.exports = { listInfo };
