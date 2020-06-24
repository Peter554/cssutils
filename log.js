const chalk = require('chalk')

const levels = {
    info: chalk.bold.blue,
    success: chalk.bold.green,
    error: chalk.bold.red,
}

const log = Object.keys(levels).reduce(
    (o, level) => ({ ...o, [level]: (s) => console.log(levels[level](s)) }),
    {}
)

module.exports = log
