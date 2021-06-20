const { generateVariables } = require("./generators/generateVariables");
const { generateSassVariables } = require("./generators/generateSassVariables");
const { generateUtilities } = require("./generators/generateUtilities");

module.exports = {
  variables: generateVariables,
  utilities: generateUtilities,
  sassVariables: generateSassVariables,
};
