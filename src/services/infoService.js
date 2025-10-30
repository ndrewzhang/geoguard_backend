// Simple items service — replace with DB calls as needed
async function getInfo() {
  // Simulate async work (e.g., DB call). For now return static data.
  return [
    { id: 1, name: 'Sample Info A', description: 'An example info' },
    { id: 2, name: 'Sample Info B', description: 'Another piece of info' }
  ];
}

module.exports = { getInfo };
