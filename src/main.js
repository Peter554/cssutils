const { getConfig } = require("./getConfig");
const { generateVariables } = require("./generators/generateVariables");
const { generateSassVariables } = require("./generators/generateSassVariables");
const { generateUtilities } = require("./generators/generateUtilities");

module.exports = {
  variables: ({ configPath } = {}) => {
    const config = getConfig(configPath);
    return generateVariables(config);
  },
  utilities: ({ configPath, noSubstitute } = {}) => {
    const substitute = !noSubstitute;
    const config = getConfig(configPath);
    return generateUtilities(config, substitute);
  },
  sassVariables: ({ configPath } = {}) => {
    const config = getConfig(configPath);
    return generateSassVariables(config);
  },
};
