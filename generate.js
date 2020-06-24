const log = require('./log')

const entries = Object.entries

const generate = (config) => {
    let css = ''

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

    for (const [k1, v1] of entries(config.generate)) {
        for (const [k2, v2] of entries(config.variables[v1.from])) {
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
                                }-${rotation}-${k2}-${k3} { ${k1}-${rotation}: ${v3}; }\n`
                            }
                        )
                    }
                }
            } else {
                css += `.${v1.alias ? v1.alias : k1}-${k2} { ${k1}: ${v2}; }\n`
                if (v1.rotations) {
                    ;['left', 'right', 'top', 'bottom'].forEach((rotation) => {
                        css += `.${
                            v1.alias ? v1.alias : k1
                        }-${rotation}-${k2} { ${k1}-${rotation}: ${v2}; }\n`
                    })
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
                                        }-${rotation}-${k2}-${k4} { ${k1}-${rotation}: ${v4}; } }\n`
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
                                    }-${rotation}-${k2} { ${k1}-${rotation}: ${v2}; } }\n`
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
                                        }-${rotation}-${k2}-${k4}:${k3} { ${k1}-${rotation}: ${v4}; }\n`
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
                                    }-${rotation}-${k2}:${k3} { ${k1}-${rotation}: ${v2}; }\n`
                                }
                            )
                        }
                    }
                })
            }
        }
        css += '\n'
    }

    return css.trim() + '\n'
}

module.exports = generate
