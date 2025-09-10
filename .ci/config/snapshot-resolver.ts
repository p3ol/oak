export default {
  testPathForConsistencyCheck: 'Element/index.test.js',
  resolveSnapshotPath: (path, ext) => path + ext,
  resolveTestPath: (path, ext) => path.slice(0, -ext.length),
};
