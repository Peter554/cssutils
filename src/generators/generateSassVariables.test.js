const YAML = require("yaml");

const { generateSassVariables } = require("./generateSassVariables");

describe("generateSassVariables", () => {
  it("generates variables", () => {
    const config = `
variables:
  color:
    red: '#f00'
    green: '#0f0'
    blue: '#00f'`;

    const sass = generateSassVariables(YAML.parse(config));

    expect(sass).toContain("$color-red: #f00;");
    expect(sass).toContain("$color-green: #0f0;");
    expect(sass).toContain("$color-blue: #00f;");
  });

  it("generates variables with prefix", () => {
    const config = `
variables:
  color:
    red: '#f00'
    green: '#0f0'
    blue: '#00f'
prefix: app`;

    const sass = generateSassVariables(YAML.parse(config));

    expect(sass).toContain("$app-color-red: #f00;");
    expect(sass).toContain("$app-color-green: #0f0;");
    expect(sass).toContain("$app-color-blue: #00f;");
  });

  it("generates nested variables", () => {
    const config = `
variables:
  color:
    gray:
      DEFAULT: '#cccccc'
      100: '#f5f5f5'
      200: '#eeeeee'
      300: '#e0e0e0'`;

    const sass = generateSassVariables(YAML.parse(config));

    expect(sass).toContain("$color-gray: #cccccc;");
    expect(sass).not.toContain("$color-gray-DEFAULT");

    expect(sass).toContain("$color-gray-300: #e0e0e0;");
    expect(sass).toContain("$color-gray-300: #e0e0e0;");
    expect(sass).toContain("$color-gray-300: #e0e0e0;");
  });
});
