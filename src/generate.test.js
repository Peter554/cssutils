const YAML = require('yaml')

const generate = require('./generate')

describe('generate', () => {
  describe('variables', () => {
    it('generates variables', () => {
      const config = `
variables:
    color:
        red: '#f00'
        green: '#0f0'
        blue: '#00f'`

      css = generate(YAML.parse(config))

      expect(css).toEqual(
        `
:root {
    --color-red: #f00;
    --color-green: #0f0;
    --color-blue: #00f;
}`.trim()
      )
    })

    it('generates nested variables', () => {
      const config = `
variables:
    color:
        gray:
            100: '#f5f5f5'
            200: '#eeeeee'
            300: '#e0e0e0'`

      css = generate(YAML.parse(config))

      expect(css).toEqual(
        `
:root {
    --color-gray-100: #f5f5f5;
    --color-gray-200: #eeeeee;
    --color-gray-300: #e0e0e0;
}`.trim()
      )
    })
  })

  describe('utils', () => {
    it('generates utils', () => {
      const config = `
generate:
    color:
        from:
            red: '#f00'
            green: '#0f0'
            blue: '#00f'`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.color-red { color: #f00; }`)
      expect(css).toContain(`.color-green { color: #0f0; }`)
      expect(css).toContain(`.color-blue { color: #00f; }`)
    })

    it('generates utils with alias', () => {
      const config = `
generate:
    color:
        alias: colour
        from:
            red: '#f00'
            green: '#0f0'
            blue: '#00f'`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.colour-red { color: #f00; }`)
      expect(css).toContain(`.colour-green { color: #0f0; }`)
      expect(css).toContain(`.colour-blue { color: #00f; }`)
    })

    it('generates nested utils ', () => {
      const config = `
generate:
    color:
        from:
            red: '#f00'
            green: '#0f0'
            gray:
                100: '#f5f5f5'
                200: '#eeeeee'
                300: '#e0e0e0'`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.color-red { color: #f00; }`)
      expect(css).toContain(`.color-green { color: #0f0; }`)
      expect(css).toContain(`.color-gray-100 { color: #f5f5f5; }`)
      expect(css).toContain(`.color-gray-200 { color: #eeeeee; }`)
      expect(css).toContain(`.color-gray-300 { color: #e0e0e0; }`)
    })

    it('generates utils from variables', () => {
      const config = `
variables:
    color:
        red: '#f00'
        green: '#0f0'
        blue: '#00f'
generate:
    color:
        from: color`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.color-red { color: #f00; }`)
      expect(css).toContain(`.color-green { color: #0f0; }`)
      expect(css).toContain(`.color-blue { color: #00f; }`)
    })

    it('generates nested utils from variables', () => {
      const config = `
variables:
    color:
        gray:
            100: '#f5f5f5'
            200: '#eeeeee'
            300: '#e0e0e0'
generate:
    color:
        from: color`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.color-gray-100 { color: #f5f5f5; }`)
      expect(css).toContain(`.color-gray-200 { color: #eeeeee; }`)
      expect(css).toContain(`.color-gray-300 { color: #e0e0e0; }`)
    })

    it('generates responsive utils', () => {
      const config = `
generate:
    color:
        from:
            red: '#f00'
            green: '#0f0'
        responsive: true
breakpoints:
    md: 800px
    lg: 1200px`

      css = generate(YAML.parse(config))

      expect(css).toContain(
        `@media (min-width: 800px) { .md\\:color-red { color: #f00; } }`
      )
      expect(css).toContain(
        `@media (min-width: 1200px) { .lg\\:color-red { color: #f00; } }`
      )
      expect(css).toContain(
        `@media (min-width: 800px) { .md\\:color-green { color: #0f0; } }`
      )
      expect(css).toContain(
        `@media (min-width: 1200px) { .lg\\:color-green { color: #0f0; } }`
      )
    })

    it('generates pseudo utils', () => {
      const config = `
generate:
    color:
        from:
            red: '#f00'
            green: '#0f0'
        pseudo: [hover, focus]`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.hover\\:color-red:hover { color: #f00; }`)
      expect(css).toContain(`.focus\\:color-red:focus { color: #f00; }`)
      expect(css).toContain(`.hover\\:color-green:hover { color: #0f0; }`)
      expect(css).toContain(`.focus\\:color-green:focus { color: #0f0; }`)
    })

    it('generates util rotations', () => {
      const config = `
generate:
    padding:
        from:
            md: 0.5rem
            lg: 1rem
        rotations: true`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.padding-md { padding: 0.5rem; }`)
      expect(css).toContain(`.padding-top-md { padding-top: 0.5rem; }`)
      expect(css).toContain(`.padding-bottom-md { padding-bottom: 0.5rem; }`)
      expect(css).toContain(`.padding-left-md { padding-left: 0.5rem; }`)
      expect(css).toContain(`.padding-right-md { padding-right: 0.5rem; }`)

      expect(css).toContain(`.padding-lg { padding: 1rem; }`)
      expect(css).toContain(`.padding-top-lg { padding-top: 1rem; }`)
      expect(css).toContain(`.padding-bottom-lg { padding-bottom: 1rem; }`)
      expect(css).toContain(`.padding-left-lg { padding-left: 1rem; }`)
      expect(css).toContain(`.padding-right-lg { padding-right: 1rem; }`)
    })

    it('generates a complex util', () => {
      const config = `
generate:
    padding:
        from:
            md: 0.5rem
            lg: 1rem
        responsive: true
        pseudo: [hover, focus]
        rotations: true
breakpoints:
    md: 800px
    lg: 1200px`

      css = generate(YAML.parse(config))

      expect(css).toContain('.padding-md { padding: 0.5rem; }')

      expect(css).toContain(
        '@media (min-width: 800px) { .md\\:padding-md { padding: 0.5rem; } }'
      )
      expect(css).toContain('.hover\\:padding-md:hover { padding: 0.5rem; }')
      expect(css).toContain('.padding-top-md { padding-top: 0.5rem; }')

      expect(css).toContain(
        '@media (min-width: 800px) { .md\\:padding-left-md { padding-left: 0.5rem; } }'
      )
      expect(css).toContain(
        '@media (min-width: 1200px) { .lg\\:padding-bottom-lg { padding-bottom: 1rem; } }'
      )

      expect(css).toContain(
        '.hover\\:padding-right-lg:hover { padding-right: 1rem; }'
      )
      expect(css).toContain(
        '.hover\\:padding-bottom-md:hover { padding-bottom: 0.5rem; }'
      )
    })

    it('generates a complex nested util', () => {
      const config = `
generate:
    background-color:
        alias: bg-color
        from:
            gray:
                100: '#f5f5f5'
                200: '#eeeeee'
                300: '#e0e0e0'
        responsive: true
        pseudo: [hover, focus]
        rotations: true
breakpoints:
    md: 800px
    lg: 1200px`

      css = generate(YAML.parse(config))

      expect(css).toContain('.bg-color-gray-100 { background-color: #f5f5f5; }')

      expect(css).toContain(
        '@media (min-width: 1200px) { .lg\\:bg-color-gray-200 { background-color: #eeeeee; } }'
      )
      expect(css).toContain(
        '.hover\\:bg-color-gray-300:hover { background-color: #e0e0e0; }'
      )
      expect(css).toContain(
        '.bg-color-left-gray-100 { background-color-left: #f5f5f5; }'
      )

      expect(css).toContain(
        '@media (min-width: 1200px) { .lg\\:bg-color-right-gray-200 { background-color-right: #eeeeee; } }'
      )
      expect(css).toContain(
        '.hover\\:bg-color-top-gray-300:hover { background-color-top: #e0e0e0; }'
      )
    })
  })

  describe('extras', () => {
    it('generates stack', () => {
      const config = `
extras:
    stack:
        from:
            md: 0.5rem
            lg: 1rem`

      const css = generate(YAML.parse(config))

      expect(css).toContain(`.stack-md > * { margin-top: 0; }`)
      expect(css).toContain(`.stack-md > * + * { margin-top: 0.5rem; }`)
      expect(css).toContain(`.stack-lg > * { margin-top: 0; }`)
      expect(css).toContain(`.stack-lg > * + * { margin-top: 1rem; }`)
    })

    it('generates stack from variables', () => {
      const config = `
variables:
    size:
        md: 0.5rem
        lg: 1rem
extras:
    stack:
        from: size`

      const css = generate(YAML.parse(config))

      expect(css).toContain(`.stack-md > * { margin-top: 0; }`)
      expect(css).toContain(`.stack-md > * + * { margin-top: 0.5rem; }`)
      expect(css).toContain(`.stack-lg > * { margin-top: 0; }`)
      expect(css).toContain(`.stack-lg > * + * { margin-top: 1rem; }`)
    })
  })
})
