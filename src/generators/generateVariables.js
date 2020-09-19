const { header } = require("../header");

const entries = Object.entries;

const join = (...values) => values.filter((o) => !!o).join("-");

const generateVariables = (config) => {
  if (!config.variables) {
    return;
  }

  const prefix = config.prefix || "";

  const variable = (name, value) =>
    `:root { --${join(prefix, name)}: ${value}; }\n`;

  const themeVariable = (theme, name, value) =>
    `.theme-${theme} { --${join(prefix, name)}: ${value}; }\n`;

  let css = header;

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
  css += s.sort().join("") + "\n";

  if (config.themes) {
    for (const [k1, v1] of entries(config.themes)) {
      s = [];
      for (const [k2, v2] of entries(v1)) {
        for (const [k3, v3] of entries(v2)) {
          if (typeof v3 == "object") {
            for (const [k4, v4] of entries(v3)) {
              s.push(themeVariable(k1, join(k2, k3, k4), v4));
            }
          } else {
            s.push(themeVariable(k1, join(k2, k3), v3));
          }
        }
      }
      css += s.sort().join("") + "\n";
    }
  }

  return css.trim();
};

module.exports = { generateVariables };