#!/usr/bin/env node

const { existsSync } = require('fs')
const { resolve } = require('path')

const { program } = require('commander')
const chalk = require('chalk')

const log = console.log

const error = chalk.bold.red

program
    .name('cssutils')
    .arguments('<inpath> <outpath>')
    .action((inpath, outpath) => {
        inpath = resolve(inpath)
        if (!existsSync(inpath)) {
            log(error(`${inpath} does not exist`))
            return
        }
    })

program.parse(process.argv)
