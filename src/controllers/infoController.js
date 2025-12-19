const { getLocationInfo } = require('../services/infoService');
const { lookupIpstack } = require('../utils/helper');

// Controller for listing info — accepts optional query param `url`
async function listInfo(req, res, next) {
  try {
    console.log('[listInfo] Handler called');
    const { url } = req.query || {};
    console.info('[listInfo] Received request with url:', url);

    // let locationData = null;
    // try {
    //   locationData = await lookupIpstack(url, '6a42f0332fb4d3fd88b68955de0ffadf');
    //   console.info('[listInfo] Ipstack location data:', locationData);
    // } catch (err) {
    //   console.error('[listInfo] Error from lookupIpstack:', err);
    //   return res.status(500).json({ ok: false, error: 'Internal server error' });
    // }

    try {
      console.log('[listInfo] Calling getLocationInfo with url:', url);
      const items = await getLocationInfo(url);
      console.info('[listInfo] getLocationInfo result:', items);
      res.json(items);
    } catch (err) {
      console.error('[listInfo] Error from getLocationInfo:', err);
      next(err);
    }
  } catch (err) {
    console.error('[listInfo] Unexpected error:', err);
    next(err);
  }
}

module.exports = { listInfo };
