#!/usr/bin/env node

const { existsSync, readFileSync, writeFileSync } = require('fs')
const { resolve, dirname } = require('path')

const { program } = require('commander')
const chalk = require('chalk')
const YAML = require('yaml')
const { mkdir } = require('shelljs')

const log = console.log
const info = chalk.bold.blue
const success = chalk.bold.green
const error = chalk.bold.red

program
    .name('cssutils')
    .description('A CSS utility class generator.')
    .arguments('<config> <output>')
    .action((config, output) => {
        config = resolve(config)
        output = resolve(output)

        if (!existsSync(config)) {
            log(error(`Config file ${config} does not exist.`))
            return
        }

        config = YAML.parse(readFileSync(config, 'utf8'))

        css = 'css'

        mkdir('-p', dirname(output))
        writeFileSync(output, css)
        log(success('CSS utilites were successfully generated.'))
        log(success(`Output has been written to ${output}.`))
    })

program.parse(process.argv)
