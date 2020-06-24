#!/usr/bin/env node

const { existsSync, readFileSync, writeFileSync } = require('fs')
const { resolve, dirname } = require('path')

const { program } = require('commander')
const chalk = require('chalk')
const YAML = require('yaml')
const { mkdir } = require('shelljs')

const log = console.log
const error = chalk.bold.red

program
    .name('cssutils')
    .description('A CSS utility class generator.')
    .arguments('<config> <output>')
    .action((config, output) => {
        config = resolve(config)
        output = resolve(output)

        if (!existsSync(config)) {
            log(error(`${config} does not exist`))
            return
        }

        config = YAML.parse(readFileSync(config, 'utf8'))

        css = 'css'

        mkdir('-p', dirname(output))
        writeFileSync(output, css)
    })

program.parse(process.argv)
