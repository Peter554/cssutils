const entries = Object.entries

const propertyRotations = {
    'border-width': (rotation) => `border-${rotation}-width`,
}

const rotate = (key, rotation) => {
    if (propertyRotations[key]) {
        return propertyRotations[key](rotation)
    } else {
        return `${key}-${rotation}`
    }
}

const generate = (config) => {
    let css = ''

    if (config.variables) {
        css += ':root {\n'
        for (const [k1, v1] of entries(config.variables)) {
            for (const [k2, v2] of entries(v1)) {
                if (typeof v2 == 'object') {
                    for (const [k3, v3] of entries(v2)) {
                        css += `    --${k1}-${k2}-${k3}: ${v3};\n`
                    }
                } else {
                    css += `    --${k1}-${k2}: ${v2};\n`
                }
            }
        }
        css += '}\n\n'
    }

    if (config.generate) {
        for (const [k1, v1] of entries(config.generate)) {
            for (const [k2, v2] of entries(
                typeof v1.from == 'object' ? v1.from : config.variables[v1.from]
            )) {
                if (typeof v2 == 'object') {
                    for (const [k3, v3] of entries(v2)) {
                        css += `.${
                            v1.alias ? v1.alias : k1
                        }-${k2}-${k3} { ${k1}: ${v3}; }\n`
                        if (v1.rotations) {
                            ;['left', 'right', 'top', 'bottom'].forEach(
                                (rotation) => {
                                    css += `.${
                                        v1.alias ? v1.alias : k1
                                    }-${rotation}-${k2}-${k3} { ${rotate(
                                        k1,
                                        rotation
                                    )}: ${v3}; }\n`
                                }
                            )
                        }
                    }
                } else {
                    css += `.${
                        v1.alias ? v1.alias : k1
                    }-${k2} { ${k1}: ${v2}; }\n`
                    if (v1.rotations) {
                        ;['left', 'right', 'top', 'bottom'].forEach(
                            (rotation) => {
                                css += `.${
                                    v1.alias ? v1.alias : k1
                                }-${rotation}-${k2} { ${rotate(
                                    k1,
                                    rotation
                                )}: ${v2}; }\n`
                            }
                        )
                    }
                }

                if (v1.responsive && config.breakpoints) {
                    for (const [k3, v3] of entries(config.breakpoints)) {
                        if (typeof v2 == 'object') {
                            for (const [k4, v4] of entries(v2)) {
                                css += `@media (min-width: ${v3}) { .${k3}\\:${
                                    v1.alias ? v1.alias : k1
                                }-${k2}-${k4} { ${k1}: ${v4}; } }\n`
                                if (v1.rotations) {
                                    ;['left', 'right', 'top', 'bottom'].forEach(
                                        (rotation) => {
                                            css += `@media (min-width: ${v3}) { .${k3}\\:${
                                                v1.alias ? v1.alias : k1
                                            }-${rotation}-${k2}-${k4} { ${rotate(
                                                k1,
                                                rotation
                                            )}: ${v4}; } }\n`
                                        }
                                    )
                                }
                            }
                        } else {
                            css += `@media (min-width: ${v3}) { .${k3}\\:${
                                v1.alias ? v1.alias : k1
                            }-${k2} { ${k1}: ${v2}; } }\n`
                            if (v1.rotations) {
                                ;['left', 'right', 'top', 'bottom'].forEach(
                                    (rotation) => {
                                        css += `@media (min-width: ${v3}) { .${k3}\\:${
                                            v1.alias ? v1.alias : k1
                                        }-${rotation}-${k2} { ${rotate(
                                            k1,
                                            rotation
                                        )}: ${v2}; } }\n`
                                    }
                                )
                            }
                        }
                    }
                }

                if (v1.pseudo) {
                    v1.pseudo.forEach((k3) => {
                        if (typeof v2 == 'object') {
                            for (const [k4, v4] of entries(v2)) {
                                css += `.${k3}\\:${
                                    v1.alias ? v1.alias : k1
                                }-${k2}-${k4}:${k3} { ${k1}: ${v4}; }\n`
                                if (v1.rotations) {
                                    ;['left', 'right', 'top', 'bottom'].forEach(
                                        (rotation) => {
                                            css += `.${k3}\\:${
                                                v1.alias ? v1.alias : k1
                                            }-${rotation}-${k2}-${k4}:${k3} { ${rotate(
                                                k1,
                                                rotation
                                            )}: ${v4}; }\n`
                                        }
                                    )
                                }
                            }
                        } else {
                            css += `.${k3}\\:${
                                v1.alias ? v1.alias : k1
                            }-${k2}:${k3} { ${k1}: ${v2}; }\n`
                            if (v1.rotations) {
                                ;['left', 'right', 'top', 'bottom'].forEach(
                                    (rotation) => {
                                        css += `.${k3}\\:${
                                            v1.alias ? v1.alias : k1
                                        }-${rotation}-${k2}:${k3} { ${rotate(
                                            k1,
                                            rotation
                                        )}: ${v2}; }\n`
                                    }
                                )
                            }
                        }
                    })
                }
            }
            css += '\n'
        }
    }

    if (config.extras) {
        if (config.extras.stack) {
            for (const [k1, v1] of entries(
                typeof config.extras.stack.from == 'object'
                    ? config.extras.stack.from
                    : config.variables[config.extras.stack.from]
            )) {
                css += `.stack-${k1} > * { margin-top: 0; } \n`
                css += `.stack-${k1} > * + * { margin-top: ${v1}; } \n`
            }
        }
    }

    return css.trim()
}

module.exports = generate
