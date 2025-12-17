const { getItems } = require('../services/itemsService');

// Controller for listing items
async function listItems(req, res, next) {
  try {
    const items = await getItems();
    res.json({ ok: true, data: items });
  } catch (err) {
    next(err);
  }
}

module.exports = { listItems };
