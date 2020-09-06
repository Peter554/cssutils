const { existsSync, readFileSync } = require('fs')
const { resolve, extname } = require('path')

const YAML = require('yaml')
const { cosmiconfigSync } = require('cosmiconfig')

const log = require('./logging')

const getConfig = (configPath) => {
  if (configPath) {
    config = resolve(configPath)
    if (!existsSync(config)) {
      log.error(`Configuration file ${config} does not exist.`)
      process.exit(1)
    }
    config = readFileSync(config, 'utf8')
    return extname(config) == '.json' ? JSON.parse(config) : YAML.parse(config)
  } else {
    const explorer = cosmiconfigSync('cssutils', {
      searchPlaces: ['cssutils.yml', 'cssutils.yaml', 'cssutils.json'],
    })
    const searchResult = explorer.search()
    if (!searchResult) {
      log.error(`Configuration file discovery failed.`)
      process.exit(1)
    }
    return searchResult.config
  }
}

module.exports = { getConfig }
