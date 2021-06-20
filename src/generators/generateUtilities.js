const { header } = require("../header");

const entries = Object.entries;

const join = (...values) =>
  values
    .filter((o) => !!o)
    .filter((o) => o != "default")
    .join("-");

const sortFunc = (a, b) => {
  if (!/@media/.test(a) && !/@media/.test(b)) {
    return a < b ? -1 : +1;
  }
  if (!/@media/.test(a)) {
    return -1;
  }
  if (!/@media/.test(b)) {
    return +1;
  }
  const extract = (s) => parseInt(s.match(/@media \(min-width: (\d+)/)[1]);
  return extract(a) < extract(b) ? -1 : +1;
};

const rotate = (key, rotation) => {
  if (!rotation) {
    return key;
  }
  if (rotation == "x") {
    return [rotate(key, "l"), rotate(key, "r")];
  }
  if (rotation == "y") {
    return [rotate(key, "t"), rotate(key, "b")];
  }
  rotation = {
    l: "left",
    r: "right",
    t: "top",
    b: "bottom",
  }[rotation];
  const rotations = {
    "border-width": (rotation) => `border-${rotation}-width`,
  };
  if (rotations[key]) {
    return rotations[key](rotation);
  } else {
    return `${key}-${rotation}`;
  }
};

const pick = (o, keys) => {
  if (keys === true) {
    return o;
  }
  const r = {};
  keys.forEach((k) => {
    r[k] = o[k];
  });
  return r;
};

const generateUtilities = (config, substitute = true) => {
  const prefix = config.prefix || "";
  const terminator = config.important ? " !important;" : ";";

  const mapProperties = (properties, value, terminator) =>
    (typeof properties == "object" ? properties : [properties])
      .map((property) => `${property}: ${value}${terminator}`)
      .join(" ");

  const util = {
    simple: (className, properties, value) => {
      return `.${join(prefix, className)} { ${mapProperties(
        properties,
        value,
        terminator
      )} }\n`;
    },
    responsive: (minWidth, breakpointName, className, properties, value) =>
      `@media (min-width: ${minWidth}) { .${breakpointName}\\:${join(
        prefix,
        className
      )} { ${mapProperties(properties, value, terminator)} } }\n`,
    pseudo: (pseudoName, pseudoClasses, className, properties, value) => {
      return (typeof pseudoClasses == "object"
        ? pseudoClasses
        : [pseudoClasses]
      )
        .map(
          (pseudoClass) =>
            `.${pseudoName}\\:${join(
              prefix,
              className
            )}:${pseudoClass} { ${mapProperties(
              properties,
              value,
              terminator
            )} }\n`
        )
        .join("");
    },
  };

  let css = header;

  if (!substitute) {
    for (const [k1, v1] of entries(config.variables || {})) {
      for (const [k2, v2] of entries(v1)) {
        if (typeof v2 == "object") {
          for (const [k3, v3] of entries(v2)) {
            config.variables[k1][k2][k3] = `var(--${join(prefix, k1, k2, k3)})`;
          }
        } else {
          config.variables[k1][k2] = `var(--${join(prefix, k1, k2)})`;
        }
      }
    }
  }

  for (const [k1, v1] of entries(config.utilities || {})) {
    const s = [];

    const rotations = v1.rotations ? ["", "l", "r", "t", "b", "x", "y"] : [""];

    for (const [k2, v2] of entries(
      typeof v1.from == "object" ? v1.from : config.variables[v1.from]
    )) {
      for (const [k3, v3] of typeof v2 == "object" ? entries(v2) : [[k2, v2]]) {
        rotations.forEach((rotation) => {
          s.push(
            util.simple(
              join(
                v1.alias ? v1.alias : k1,
                rotation,
                k3 == k2 ? k2 : join(k2, k3)
              ),
              rotate(k1, rotation),
              v3
            )
          );
        });
      }

      if (v1.breakpoints && config.breakpoints) {
        for (const [k3, v3] of entries(
          pick(
            typeof config.breakpoints == "object"
              ? config.breakpoints
              : config.variables[config.breakpoints],
            v1.breakpoints
          )
        )) {
          for (const [k4, v4] of typeof v2 == "object"
            ? entries(v2)
            : [[k2, v2]]) {
            rotations.forEach((rotation) => {
              s.push(
                util.responsive(
                  v3,
                  k3,
                  join(
                    v1.alias ? v1.alias : k1,
                    rotation,
                    k4 == k2 ? k2 : join(k2, k4)
                  ),
                  rotate(k1, rotation),
                  v4
                )
              );
            });
          }
        }
      }

      if (v1.pseudo && config.pseudo) {
        for (const [k3, v3] of entries(pick(config.pseudo, v1.pseudo))) {
          for (const [k4, v4] of typeof v2 == "object"
            ? entries(v2)
            : [[k2, v2]]) {
            rotations.forEach((rotation) => {
              s.push(
                util.pseudo(
                  k3,
                  v3,
                  join(
                    v1.alias ? v1.alias : k1,
                    rotation,
                    k4 == k2 ? k2 : join(k2, k4)
                  ),
                  rotate(k1, rotation),
                  v4
                )
              );
            });
          }
        }
      }
    }
    css += s.sort(sortFunc).join("") + "\n";
  }

  return css.trim();
};

module.exports = { generateUtilities, _sortFunc: sortFunc };
