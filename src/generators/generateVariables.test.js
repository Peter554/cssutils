const { generateVariables } = require("./generateVariables");

describe("generateVariables", () => {
  it("generates variables", () => {
    const config = {
      variables: {
        color: {
          red: "#f00",
          green: "#0f0",
          blue: "#00f",
        },
      },
    };

    css = generateVariables(config);

    expect(css).toContain(":root { --color-red: #f00; }");
    expect(css).toContain(":root { --color-green: #0f0; }");
    expect(css).toContain(":root { --color-blue: #00f; }");
  });

  it("generates variables with prefix", () => {
    const config = {
      variables: {
        color: {
          red: "#f00",
          green: "#0f0",
          blue: "#00f",
        },
      },
      prefix: "app",
    };

    css = generateVariables(config);

    expect(css).toContain(":root { --app-color-red: #f00; }");
    expect(css).toContain(":root { --app-color-green: #0f0; }");
    expect(css).toContain(":root { --app-color-blue: #00f; }");
  });

  it("generates nested variables", () => {
    const config = {
      variables: {
        color: {
          gray: {
            DEFAULT: "#cccccc",
            "100": "#f5f5f5",
            "200": "#eeeeee",
            "300": "#e0e0e0",
          },
        },
      },
    };

    css = generateVariables(config);

    expect(css).toContain(":root { --color-gray: #cccccc; }");
    expect(css).not.toContain("--color-gray-DEFAULT");

    expect(css).toContain(":root { --color-gray-100: #f5f5f5; }");
    expect(css).toContain(":root { --color-gray-200: #eeeeee; }");
    expect(css).toContain(":root { --color-gray-300: #e0e0e0; }");
  });
});
