const { getInfo } = require('../services/infoService');

// Basic URL validation using the WHATWG URL constructor
function isValidUrl(value) {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
}

// Controller for listing info — accepts optional query param `url`
async function listInfo(req, res, next) {
  try {
    const { url } = req.query || {};

    if (url !== undefined && url !== null && url !== '') {
      if (!isValidUrl(url)) {
        return res.status(400).json({ ok: false, error: 'Invalid url parameter' });
      }
    }

    const items = await getInfo(url);
    res.json({ ok: true, data: items });
  } catch (err) {
    next(err);
  }
}

module.exports = { listInfo };
