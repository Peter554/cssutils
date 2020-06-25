#!/usr/bin/env node

const { existsSync, readFileSync, writeFileSync } = require('fs')
const { resolve, dirname, extname } = require('path')

const { program } = require('commander')
const chalk = require('chalk')
const YAML = require('yaml')
const { mkdir } = require('shelljs')
const CleanCSS = require('clean-css')

const generate = require('./generate')

const log = {
  success: (s) => console.log(chalk.bold.green(s)),
  error: (s) => console.error(chalk.bold.red(s)),
}

program
  .name('cssutils')
  .arguments('<config>')
  .description('<config>    Configuration file (YAML or JSON).')
  .option(
    '-o, --output <path>',
    'Output path for generated CSS. If missing CSS is written to stdout.'
  )
  .option('-nm, --nomin', 'Disable CSS minification.')
  .option('-i, --important', 'Use !important for utility classes.')
  .action((config, cmd) => {
    config = resolve(config)

    if (!existsSync(config)) {
      log.error(`Config file ${config} does not exist.`)
      process.exit(1)
    }

    config = readFileSync(config, 'utf8')
    config = extname(config) == '.json' ? config : YAML.parse(config)

    css = generate(config)
    css = cmd.nomin ? css : new CleanCSS({ level: 2 }).minify(css).styles

    if (cmd.output) {
      let output = resolve(cmd.output)
      mkdir('-p', dirname(output))
      writeFileSync(output, css)
      log.success(`CSS has been written to ${output}.`)
    } else {
      console.log(css)
    }
  })

program.parse(process.argv)
