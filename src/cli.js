#!/usr/bin/env node

const { existsSync, readFileSync, writeFileSync } = require('fs')
const { resolve, dirname, extname } = require('path')

const { program } = require('commander')
const YAML = require('yaml')
const { mkdir } = require('shelljs')
const CleanCSS = require('clean-css')
const { cosmiconfigSync } = require('cosmiconfig')

const { generate } = require('./generate')

const log = {
  success: (s) => console.log(s),
  error: (s) => console.error(s),
}

const getConfig = (cmd) => {
  let config
  if (cmd.config) {
    config = resolve(cmd.config)

    if (!existsSync(config)) {
      log.error(`Configuration file ${config} does not exist.`)
      process.exit(1)
    }

    config = readFileSync(config, 'utf8')
    config =
      extname(config) == '.json' ? JSON.parse(config) : YAML.parse(config)
  } else {
    const explorer = cosmiconfigSync('cssutils', {
      searchPlaces: ['cssutils.yml', 'cssutils.yaml', 'cssutils.json'],
    })
    const searchResult = explorer.search()

    if (!searchResult) {
      log.error(`Configuration file discovery failed.`)
      process.exit(1)
    }

    config = searchResult.config
  }
  return config
}

program
  .name('cssutils')
  .option(
    '-c, --config <path>',
    'Path to the configuration file (YAML or JSON). If missing configuration will be discovered via cosmiconfig.'
  )
  .option(
    '-o, --output <path>',
    'Output path for generated CSS. If missing CSS is written to stdout.'
  )
  .option('-nm, --nomin', 'Disable CSS minification.')
  .action((cmd) => {
    const config = getConfig(cmd)
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
