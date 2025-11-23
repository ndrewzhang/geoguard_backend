const { getInfo } = require('../services/infoService');
const { resolveUrlToIp } = require('../utils/helper');

// Controller for listing info — accepts optional query param `url`
async function listInfo(req, res, next) {
  try {
    const { url } = req.query || {};

    let resolvedIp = null;

    if (url !== undefined && url !== null && url !== '') {
      // Use the project's helper to resolve the URL to an IP.
      try {
        // resolveUrlToIp throws TypeError for bad input and other Errors for DNS failures
        resolvedIp = await resolveUrlToIp(url);
      } catch (err) {
        if (err instanceof TypeError) {
          return res.status(400).json({ ok: false, error: err.message || 'Invalid url parameter' });
        }
        // DNS/lookup errors -> Bad Gateway (502)
        return res.status(502).json({ ok: false, error: 'Failed to resolve url to IP' });
      }
    }

    const items = await getInfo(url);
    res.json({ ok: true, ip: resolvedIp });
  } catch (err) {
    next(err);
  }
}

module.exports = { listInfo };
