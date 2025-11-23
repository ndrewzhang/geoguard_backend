// Simple items service — replace with DB calls as needed
async function getInfo(url) {
  // Simulate async work (e.g., DB call or fetching remote URL).
  // If a url is provided, include it in the response to demonstrate usage.
  const base = [
    { id: 1, name: 'Sample Info A', description: 'An example info' },
    { id: 2, name: 'Sample Info B', description: 'Another piece of info' }
  ];

  if (url) {
    // In a real implementation you might fetch or process the URL here.
    // if (url !== undefined && url !== null && url !== '') {
      // Use the project's helper to resolve the URL to an IP.
    // let resolvedIp = null;
    // try {
    //   // resolveUrlToIp throws TypeError for bad input and other Errors for DNS failures
    //   resolvedIp = await resolveUrlToIp(url);
    // } catch (err) {
    //   if (err instanceof TypeError) {
    //     return res.status(400).json({ ok: false, error: err.message || 'Invalid url parameter' });
    //   }
    //   // DNS/lookup errors -> Bad Gateway (502)
    //   return res.status(502).json({ ok: false, error: 'Failed to resolve url to IP' });
    // }
    // }

    return base.map(item => ({ ...item, sourceUrl: url }));
  }

  return base;
}

module.exports = { getInfo };
