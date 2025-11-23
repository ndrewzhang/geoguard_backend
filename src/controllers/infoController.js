const { getInfo } = require('../services/infoService');
const { resolveUrlToIp } = require('../utils/helper');
const { lookupIpstack } = require('../utils/helper');

// Controller for listing info — accepts optional query param `url`
async function listInfo(req, res, next) {
  try {
    const { url } = req.query || {};
    console.info('[listInfo] Received request with url:', url);

    // let resolvedIp = null;

    // if (url !== undefined && url !== null && url !== '') {
    //   try {
    //     resolvedIp = await resolveUrlToIp(url);
    //     console.info('[listInfo] Resolved IP:', resolvedIp);
    //   } catch (err) {
    //     console.error('[listInfo] Error resolving URL to IP:', err);
    //     if (err instanceof TypeError) {
    //       return res.status(400).json({ ok: false, error: err.message || 'Invalid url parameter' });
    //     }
    //     return res.status(502).json({ ok: false, error: 'Failed to resolve url to IP' });
    //   }
    // }

    let locationData = null;
    try {
      locationData = await lookupIpstack(url, 'API KEY HERE');
      console.info('[listInfo] Ipstack location data:', locationData);
    } catch (err) {
      console.error('[listInfo] Error from lookupIpstack:', err);
      return res.status(500).json({ ok: false, error: 'Internal server error' });
    }

    try {
      const items = await getInfo(url);
      console.info('[listInfo] getInfo result:', items);
      res.json({ ok: true, ip: resolvedIp, data: locationData });
    } catch (err) {
      console.error('[listInfo] Error from getInfo:', err);
      next(err);
    }
  } catch (err) {
    console.error('[listInfo] Unexpected error:', err);
    next(err);
  }
}

module.exports = { listInfo };
