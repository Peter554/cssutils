const { existsSync, readFileSync } = require("fs");
const { resolve, extname } = require("path");

const YAML = require("yaml");
const { cosmiconfigSync } = require("cosmiconfig");

const getConfig = (configPath) => {
  if (configPath) {
    config = resolve(configPath);
    if (!existsSync(config)) {
      throw Error(`Configuration file ${config} does not exist.`);
    }
    config = readFileSync(config, "utf8");
    return extname(config) == ".json" ? JSON.parse(config) : YAML.parse(config);
  } else {
    const explorer = cosmiconfigSync("cssutils", {
      searchPlaces: ["cssutils.yml", "cssutils.yaml", "cssutils.json"],
    });
    const searchResult = explorer.search();
    if (!searchResult) {
      throw Error(`Configuration file discovery failed.`);
    }
    return searchResult.config;
  }
};

module.exports = { getConfig };
