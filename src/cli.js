#!/usr/bin/env node

const { writeFileSync } = require("fs");
const { resolve, dirname } = require("path");

const { cosmiconfigSync } = require("cosmiconfig");
const YAML = require("yaml");
const { program } = require("commander");
const { mkdir } = require("shelljs");

const { generateVariables } = require("./generators/generateVariables");
const { generateSassVariables } = require("./generators/generateSassVariables");
const { generateUtilities } = require("./generators/generateUtilities");

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

program.name("cssutils");

program
  .command("variables")
  .description("Generate CSS variables (custom properties).")
  .option(
    "-c, --config <path>",
    "Path to the configuration file (YAML or JSON)."
  )
  .option(
    "-o, --output <path>",
    "Path to write the output. If not provided will write to stdout."
  )
  .action((cmd) => {
    const config = getConfig(cmd.config);
    let css = generateVariables(config);
    if (cmd.output) {
      const output = resolve(cmd.output);
      mkdir("-p", dirname(output));
      writeFileSync(output, css);
      console.log(`CSS has been written to ${output}.`);
    } else {
      console.log(css);
    }
  });

program
  .command("sassvariables")
  .description("Generate SASS/SCSS variables.")
  .option(
    "-c, --config <path>",
    "Path to the configuration file (YAML or JSON)."
  )
  .option(
    "-o, --output <path>",
    "Path to write the output. If not provided will write to stdout."
  )
  .action((cmd) => {
    const config = getConfig(cmd.config);
    const sass = generateSassVariables(config);
    if (cmd.output) {
      const output = resolve(cmd.output);
      mkdir("-p", dirname(output));
      writeFileSync(output, sass);
      console.log(`SASS has been written to ${output}.`);
    } else {
      console.log(sass);
    }
  });

program
  .command("utilities")
  .description("Generate utility classes.")
  .option(
    "-c, --config <path>",
    "Path to the configuration file (YAML or JSON)."
  )
  .option(
    "-o, --output <path>",
    "Path to write the output. If not provided will write to stdout."
  )
  .option(
    "--keep-variables",
    "Keep CSS variables, do not substitute their values."
  )
  .action((cmd) => {
    const config = getConfig(cmd.config);
    let css = generateUtilities(config, cmd["keep-variables"]);
    if (cmd.output) {
      const output = resolve(cmd.output);
      mkdir("-p", dirname(output));
      writeFileSync(output, css);
      console.log(`CSS has been written to ${output}.`);
    } else {
      console.log(css);
    }
  });

program.parse(process.argv);
