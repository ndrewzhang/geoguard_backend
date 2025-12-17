const { lookupIpstack } = require('../utils/helper');

// Simple items service — replace with DB calls as needed
async function getLocationInfo(url) {
  // Simulate async work (e.g., DB call or fetching remote URL).
  // If a url is provided, include it in the response to demonstrate usage.
  const base = [
    { id: 1, name: 'Sample Info A', description: 'An example info' },
    { id: 2, name: 'Sample Info B', description: 'Another piece of info' }
  ];

  if (url) {

    let locationData = null;
    try {
      locationData = await lookupIpstack(url, process.env.IPSTACK_API_KEY);
      console.info('[getLocationInfo] Ipstack location data:', locationData);
    } catch (err) {
      console.error('[getLocationInfo] Error from lookupIpstack:', err);
      throw err;
    }

    //return base.map(item => ({ ...item, sourceUrl: url }));
    return base.map(item => ({ ...item, location: locationData }));
  }

  return base;
}

module.exports = { getLocationInfo };
