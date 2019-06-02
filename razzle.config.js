const path = require('path');
module.exports = {
  modify: (config, { target, dev }, webpack) => {
    
    config.resolve.alias.components = path.resolve('./src/components');
    config.resolve.alias.containers = path.resolve('./src/containers');

    return config;
  },
};