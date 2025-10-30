// Simple items service — replace with DB calls as needed
async function getItems() {
  // Simulate async work (e.g., DB call). For now return static data.
  return [
    { id: 1, name: 'Sample Item A', description: 'An example item' },
    { id: 2, name: 'Sample Item B', description: 'Another example' }
  ];
}

module.exports = { getItems };
