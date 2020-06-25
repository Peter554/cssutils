const entries = Object.entries

const join = (...values) => values.filter((o) => !!o).join('-')
const variable = (name, value) => `:root { --${name}: ${value}; }\n`

const util = {
  simple: (className, property, value) =>
    `.${className} { ${property}: ${value}; }\n`,
  responsive: (minWidth, breakpointName, className, property, value) =>
    `@media (min-width: ${minWidth}) { .${breakpointName}\\:${className} { ${property}: ${value}; } }\n`,
  pseudo: (pseudo, className, property, value) =>
    `.${pseudo}\\:${className}:${pseudo} { ${property}: ${value}; }\n`,
}

const rotate = (key, rotation) => {
  if (!rotation) {
    return key
  }
  const rotations = {
    'border-width': (rotation) => `border-${rotation}-width`,
  }
  if (rotations[key]) {
    return rotations[key](rotation)
  } else {
    return `${key}-${rotation}`
  }
}

const generate = (config) => {
  let css = ''

  for (const [k1, v1] of entries(config.variables || {})) {
    const s = []
    for (const [k2, v2] of entries(v1)) {
      if (typeof v2 == 'object') {
        for (const [k3, v3] of entries(v2)) {
          s.push(variable(join(k1, k2, k3), v3))
        }
      } else {
        s.push(variable(join(k1, k2), v2))
      }
    }
    css += s.sort().join('') + '\n'
  }

  for (const [k1, v1] of entries(config.generate || {})) {
    const s = []

    const rotations = v1.rotations
      ? ['', 'left', 'right', 'top', 'bottom']
      : ['']

    for (const [k2, v2] of entries(
      typeof v1.from == 'object' ? v1.from : config.variables[v1.from]
    )) {
      for (const [k3, v3] of typeof v2 == 'object' ? entries(v2) : [[k2, v2]]) {
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
          )
        })
      }

      if (v1.responsive && config.breakpoints) {
        for (const [k3, v3] of entries(
          typeof config.breakpoints == 'object'
            ? config.breakpoints
            : config.variables[config.breakpoints]
        )) {
          for (const [k4, v4] of typeof v2 == 'object'
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
              )
            })
          }
        }
      }

      ;(v1.pseudo || []).forEach((k3) => {
        for (const [k4, v4] of typeof v2 == 'object'
          ? entries(v2)
          : [[k2, v2]]) {
          rotations.forEach((rotation) => {
            s.push(
              util.pseudo(
                k3,
                join(
                  v1.alias ? v1.alias : k1,
                  rotation,
                  k4 == k2 ? k2 : join(k2, k4)
                ),
                rotate(k1, rotation),
                v4
              )
            )
          })
        }
      })
    }
    css += s.sort().join('') + '\n'
  }

  if (config.extras) {
    if (config.extras.stack) {
      const s = []
      for (const [k1, v1] of entries(
        typeof config.extras.stack.from == 'object'
          ? config.extras.stack.from
          : config.variables[config.extras.stack.from]
      )) {
        s.push(`.stack-${k1} > * { margin-top: 0; } \n`)
        s.push(`.stack-${k1} > * + * { margin-top: ${v1}; } \n`)
      }
      css += s.sort().join('') + '\n'
    }
  }

  return css.trim()
}

module.exports = generate
