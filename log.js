const chalk = require('chalk')

const levels = {
    debug: chalk.bold.magenta,
    info: chalk.bold.blue,
    success: chalk.bold.green,
    error: chalk.bold.red,
}

const log = Object.keys(levels).reduce(
    (o, level) => ({ ...o, [level]: (s) => console.log(levels[level](s)) }),
    {}
)

log.json = (s) => log.debug(JSON.stringify(s))

module.exports = log
