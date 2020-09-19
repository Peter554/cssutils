const { header } = require("../header");

const entries = Object.entries;

const join = (...values) => values.filter((o) => !!o).join("-");

const generateSassVariables = (config) => {
  if (!config.variables) {
    return;
  }

  const prefix = config.prefix || "";

  const variable = (name, value) => `$${join(prefix, name)}: ${value};\n`;

  let sass = header;

  let s = [];
  for (const [k1, v1] of entries(config.variables)) {
    for (const [k2, v2] of entries(v1)) {
      if (typeof v2 == "object") {
        for (const [k3, v3] of entries(v2)) {
          s.push(variable(join(k1, k2, k3), v3));
        }
      } else {
        s.push(variable(join(k1, k2), v2));
      }
    }
  }
  sass += s.sort().join("") + "\n";

  return sass.trim();
};

module.exports = { generateSassVariables };
