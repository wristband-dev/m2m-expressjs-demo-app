'use strict';

const NodeCache = require('node-cache');

const localCache = new NodeCache({
  checkperiod: 0,
  errorOnMissing: true,
  stdTTL: 0,
  useClones: true,
});

module.exports = localCache;
