const entries = Object.entries;

const join = (...values) =>
  values
    .filter((o) => !!o)
    .filter((o) => o != "DEFAULT")
    .join("-");

const generateVariables = (config) => {
  if (!config.variables) {
    return;
  }

  const prefix = config.prefix || "";

  const variable = (name, value) =>
    `:root { --${join(prefix, name)}: ${value}; }\n`;

  let css = "";

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

  return css.trim();
};

module.exports = { generateVariables };
