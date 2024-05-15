const { override, useBabelRc, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
   // Use custom Babel configuration
   useBabelRc(),
   // Enable top-level await experiment
   (config) => {
      config.experiments = {
         ...config.experiments,
         topLevelAwait: true,
      };
      return config;
   },
);
