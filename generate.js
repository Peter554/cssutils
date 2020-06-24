const log = require('./log')

const entries = Object.entries

const generate = (config) => {
    let css = ''

    css += ':root {\n'
    for (const [k1, v1] of entries(config.variables)) {
        for (const [k2, v2] of entries(v1)) {
            css += `    --${k1}-${k2}: ${v2};\n`
        }
    }
    css += '}\n\n'

    for (const [k1, v1] of entries(config.generate)) {
        for (const [k2, v2] of entries(config.variables[v1.from])) {
            css += `${v1.alias ? v1.alias : k1}-${k2} { ${k1}: ${v2}; }\n`
            if (v1.rotations) {
                ;['left', 'right', 'top', 'bottom'].forEach((rotation) => {
                    css += `${
                        v1.alias ? v1.alias : k1
                    }-${rotation}-${k2} { ${k1}-${rotation}: ${v2}; }\n`
                })
            }
        }
        css += '\n'
    }

    return css
}

module.exports = generate
