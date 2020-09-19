#!/usr/bin/env node

const { writeFileSync } = require("fs");
const { resolve, dirname } = require("path");

const { program } = require("commander");
const { mkdir } = require("shelljs");
const CleanCSS = require("clean-css");

const { getConfig } = require("./getConfig");
const log = require("./logging");
const { generateVariables } = require("./generators/generateVariables");
const { generateSassVariables } = require("./generators/generateSassVariables");
const { generateUtilities } = require("./generators/generateUtilities");

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
  .option("-nm, --no-min", "Disable CSS minification/optimization.")
  .action((cmd) => {
    const config = getConfig(cmd.config);
    let css = generateVariables(config);
    css = cmd.min ? new CleanCSS({ level: 2 }).minify(css).styles : css;
    if (cmd.output) {
      const output = resolve(cmd.output);
      mkdir("-p", dirname(output));
      writeFileSync(output, css);
      log.success(`CSS has been written to ${output}.`);
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
      log.success(`SASS has been written to ${output}.`);
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
  .option("-nm, --no-min", "Disable CSS minification/optimization.")
  .option("-ns, --no-substitute", "Disable CSS variable substitution.")
  .action((cmd) => {
    const config = getConfig(cmd.config);
    let css = generateUtilities(config, cmd.substitute);
    css = cmd.min ? new CleanCSS({ level: 2 }).minify(css).styles : css;
    if (cmd.output) {
      const output = resolve(cmd.output);
      mkdir("-p", dirname(output));
      writeFileSync(output, css);
      log.success(`CSS has been written to ${output}.`);
    } else {
      console.log(css);
    }
  });

program.parse(process.argv);
