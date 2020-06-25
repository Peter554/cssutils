const entries = Object.entries

const join = (...values) => values.filter((o) => !!o).join('-')

const rotate = (key, rotation) => {
  if (!rotation) {
    return key
  }
  if (rotation == 'x') {
    return [rotate(key, 'l'), rotate(key, 'r')]
  }
  if (rotation == 'y') {
    return [rotate(key, 't'), rotate(key, 'b')]
  }
  rotation = {
    l: 'left',
    r: 'right',
    t: 'top',
    b: 'bottom',
  }[rotation]
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
  const prefix = config.prefix || ''
  const terminator = config.important ? ' !important;' : ';'

  const variable = (name, value) =>
    `:root { --${join(prefix, name)}: ${value}; }\n`

  const mapProperties = (properties, value, terminator) =>
    (typeof properties == 'object' ? properties : [properties])
      .map((property) => `${property}: ${value}${terminator}`)
      .join(' ')

  const util = {
    simple: (className, properties, value) => {
      return `.${join(prefix, className)} { ${mapProperties(
        properties,
        value,
        terminator
      )} }\n`
    },
    responsive: (minWidth, breakpointName, className, properties, value) =>
      `@media (min-width: ${minWidth}) { .${breakpointName}\\:${join(
        prefix,
        className
      )} { ${mapProperties(properties, value, terminator)} } }\n`,
    pseudo: (pseudoName, pseudoClasses, className, properties, value) => {
      return (typeof pseudoClasses == 'object'
        ? pseudoClasses
        : [pseudoClasses]
      ).map(
        (pseudoClass) =>
          `.${pseudoName}\\:${join(
            prefix,
            className
          )}:${pseudoClass} { ${mapProperties(
            properties,
            value,
            terminator
          )} }\n`
      ).join('')
    },
  }

  let css = ''

  if (config.variables) {
    const s = []
    for (const [k1, v1] of entries(config.variables)) {
      for (const [k2, v2] of entries(v1)) {
        if (typeof v2 == 'object') {
          for (const [k3, v3] of entries(v2)) {
            s.push(variable(join(k1, k2, k3), v3))
          }
        } else {
          s.push(variable(join(k1, k2), v2))
        }
      }
    }
    css += s.sort().join('') + '\n'

    if (config.usevariables) {
      for (const [k1, v1] of entries(config.variables)) {
        for (const [k2, v2] of entries(v1)) {
          if (typeof v2 == 'object') {
            for (const [k3, v3] of entries(v2)) {
              config.variables[k1][k2][k3] = `var(--${join(k1, k2, k3)})`
            }
          } else {
            config.variables[k1][k2] = `var(--${join(k1, k2)})`
          }
        }
      }
    }
  }

  for (const [k1, v1] of entries(config.generate || {})) {
    const s = []

    const rotations = v1.rotations ? ['', 'l', 'r', 't', 'b', 'x', 'y'] : ['']

    for (const [k2, v2] of entries({
      ...(typeof v1.from == 'object' ? v1.from : config.variables[v1.from]),
      ...(v1.alsofrom || {}),
    })) {
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

      for (const [k3, v3] of entries(v1.pseudo || {})) {
        for (const [k4, v4] of typeof v2 == 'object'
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
            )
          })
        }
      }
    }
    css += s.sort().join('') + '\n'
  }

  if (config.extras) {
    ;['stack-x', 'stack-y', 'divide-x', 'divide-y'].forEach((extra) => {
      if (config.extras[extra]) {
        const property0 = {
          'stack-x': 'margin-right',
          'stack-y': 'margin-bottom',
          'divide-x': 'border-right-width',
          'divide-y': 'border-bottom-width',
        }[extra]
        const property1 = {
          'stack-x': 'margin-left',
          'stack-y': 'margin-top',
          'divide-x': 'border-left-width',
          'divide-y': 'border-top-width',
        }[extra]
        const s = []
        for (const [k1, v1] of entries({
          ...(typeof config.extras[extra].from == 'object'
            ? config.extras[extra].from
            : config.variables[config.extras[extra].from]),
          ...(config.extras[extra].alsofrom || {}),
        })) {
          s.push(
            `.${join(
              prefix,
              extra,
              k1
            )} > * { ${property0}: 0${terminator} ${property1}: 0${terminator} } \n`
          )
          s.push(
            `.${join(
              prefix,
              extra,
              k1
            )} > * + * { ${property1}: ${v1}${terminator} } \n`
          )
        }
        css += s.sort().join('') + '\n'
      }
    })
  }

  return css.trim()
}

module.exports = generate
