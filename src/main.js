const { getConfig } = require("./getConfig");
const { generateVariables } = require("./generators/generateVariables");
const { generateSassVariables } = require("./generators/generateSassVariables");
const { generateUtilities } = require("./generators/generateUtilities");

module.exports = {
  variables: ({ configPath } = {}) => {
    const config = getConfig(configPath);
    return generateVariables(config);
  },
  utilities: ({ configPath, keepVariables = false } = {}) => {
    const config = getConfig(configPath);
    return generateUtilities(config, keepVariables);
  },
  sassVariables: ({ configPath } = {}) => {
    const config = getConfig(configPath);
    return generateSassVariables(config);
  },
};
