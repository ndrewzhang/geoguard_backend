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
    return base.map(item => ({ ...item, sourceUrl: url }));
  }

  return base;
}

module.exports = { getInfo };
