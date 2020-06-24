const log = require('./log')

const entries = Object.entries

const generate = (config) => {
    let css = ''

    for (const [k, v] of entries(config.generate)) {
        for (const [k2, v2] of entries(config.variables[v.from])) {
            css += `${v.alias ? v.alias : k}-${k2} { ${k}: ${v2}; }\n\n`
        }
    }

    return css
}

module.exports = generate
