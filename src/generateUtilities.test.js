const YAML = require('yaml')

const { generateUtilities, _sortFunc } = require('./generateUtilities')

describe('generateUtilities', () => {
  describe('utilities', () => {
    it('generates utils', () => {
      const config = `
utilities:
  color:
    from:
      red: '#f00'
      green: '#0f0'
      blue: '#00f'`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain(`.color-red { color: #f00; }`)
      expect(css).toContain(`.color-green { color: #0f0; }`)
      expect(css).toContain(`.color-blue { color: #00f; }`)
    })

    it('generates utils with prefix', () => {
      const config = `
utilities:
  color:
    from:
      red: '#f00'
      green: '#0f0'
      blue: '#00f'
prefix: app`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain(`.app-color-red { color: #f00; }`)
      expect(css).toContain(`.app-color-green { color: #0f0; }`)
      expect(css).toContain(`.app-color-blue { color: #00f; }`)
    })

    it('generates utils with !important', () => {
      const config = `
utilities:
  color:
    from:
      red: '#f00'
      green: '#0f0'
      blue: '#00f'
important: true`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain(`.color-red { color: #f00 !important; }`)
      expect(css).toContain(`.color-green { color: #0f0 !important; }`)
      expect(css).toContain(`.color-blue { color: #00f !important; }`)
    })

    it('generates utils with alias', () => {
      const config = `
utilities:
  color:
    alias: colour
    from:
      red: '#f00'
      green: '#0f0'
      blue: '#00f'`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain(`.colour-red { color: #f00; }`)
      expect(css).toContain(`.colour-green { color: #0f0; }`)
      expect(css).toContain(`.colour-blue { color: #00f; }`)
    })

    it('generates nested utils', () => {
      const config = `
utilities:
  color:
    from:
      red: '#f00'
      green: '#0f0'
      gray:
        100: '#f5f5f5'
        200: '#eeeeee'
        300: '#e0e0e0'`

      css = generateUtilities(YAML.parse(config))

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
utilities:
  color:
    from: color`

      css = generateUtilities(YAML.parse(config))

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
utilities:
  color:
    from: color`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain(`.color-gray-100 { color: #f5f5f5; }`)
      expect(css).toContain(`.color-gray-200 { color: #eeeeee; }`)
      expect(css).toContain(`.color-gray-300 { color: #e0e0e0; }`)
    })

    it('generates breakpoint utils', () => {
      const config = `
utilities:
  color:
    from:
        red: '#f00'
        green: '#0f0'
    breakpoints: [md, lg]
breakpoints:
  md: 800px
  lg: 1200px
  xl: 1600px`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain(
        `@media (min-width: 800px) { .md\\:color-red { color: #f00; } }`
      )
      expect(css).toContain(
        `@media (min-width: 1200px) { .lg\\:color-red { color: #f00; } }`
      )
      expect(css).not.toContain(
        `@media (min-width: 1600px) { .xl\\:color-red { color: #f00; } }`
      )
      expect(css).toContain(
        `@media (min-width: 800px) { .md\\:color-green { color: #0f0; } }`
      )
      expect(css).toContain(
        `@media (min-width: 1200px) { .lg\\:color-green { color: #0f0; } }`
      )
      expect(css).not.toContain(
        `@media (min-width: 1600px) { .xl\\:color-green { color: #0f0; } }`
      )
    })

    it('generates breakpoint utils from variables', () => {
      const config = `
variables:
  breakpoint:
    md: 800px
    lg: 1200px
utilities:
  color:
    from:
        red: '#f00'
        green: '#0f0'
    breakpoints: true
breakpoints: breakpoint`

      css = generateUtilities(YAML.parse(config))

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
utilities:
  color:
    from:
      red: '#f00'
      green: '#0f0'
    pseudo: [hvr, act]
pseudo:
  hvr: hover
  fcs: [focus]
  act: [hover, focus, active]`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain(`.hvr\\:color-red:hover { color: #f00; }`)
      expect(css).not.toContain(`.fcs\\:color-red:focus { color: #f00; }`)

      expect(css).toContain(`.hvr\\:color-green:hover { color: #0f0; }`)
      expect(css).not.toContain(`.fcs\\:color-green:focus { color: #0f0; }`)

      expect(css).toContain(`.act\\:color-red:hover { color: #f00; }`)
      expect(css).toContain(`.act\\:color-red:focus { color: #f00; }`)
      expect(css).toContain(`.act\\:color-red:active { color: #f00; }`)
      expect(css).toContain(`.act\\:color-green:hover { color: #0f0; }`)
      expect(css).toContain(`.act\\:color-green:focus { color: #0f0; }`)
      expect(css).toContain(`.act\\:color-green:active { color: #0f0; }`)
    })

    it('generates util rotations', () => {
      const config = `
utilities:
  padding:
    from:
      md: 0.5rem
      lg: 1rem
    rotations: true`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain(`.padding-md { padding: 0.5rem; }`)
      expect(css).toContain(`.padding-t-md { padding-top: 0.5rem; }`)
      expect(css).toContain(`.padding-b-md { padding-bottom: 0.5rem; }`)
      expect(css).toContain(`.padding-l-md { padding-left: 0.5rem; }`)
      expect(css).toContain(`.padding-r-md { padding-right: 0.5rem; }`)
      expect(css).toContain(
        `.padding-x-md { padding-left: 0.5rem; padding-right: 0.5rem; }`
      )
      expect(css).toContain(
        `.padding-y-md { padding-top: 0.5rem; padding-bottom: 0.5rem; }`
      )

      expect(css).toContain(`.padding-lg { padding: 1rem; }`)
      expect(css).toContain(`.padding-t-lg { padding-top: 1rem; }`)
      expect(css).toContain(`.padding-b-lg { padding-bottom: 1rem; }`)
      expect(css).toContain(`.padding-l-lg { padding-left: 1rem; }`)
      expect(css).toContain(`.padding-r-lg { padding-right: 1rem; }`)
      expect(css).toContain(
        `.padding-x-lg { padding-left: 1rem; padding-right: 1rem; }`
      )
      expect(css).toContain(
        `.padding-y-lg { padding-top: 1rem; padding-bottom: 1rem; }`
      )
    })

    it('generates a complex util', () => {
      const config = `
utilities:
  padding:
    from:
      md: 0.5rem
      lg: 1rem
    pseudo: true
    breakpoints: true
    rotations: true
pseudo:
  hover: hover
  focus: [focus]
breakpoints:
  md: 800px
  lg: 1200px`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain('.padding-md { padding: 0.5rem; }')

      expect(css).toContain(
        '@media (min-width: 800px) { .md\\:padding-md { padding: 0.5rem; } }'
      )
      expect(css).toContain('.hover\\:padding-md:hover { padding: 0.5rem; }')
      expect(css).toContain('.padding-t-md { padding-top: 0.5rem; }')
      expect(css).toContain(
        '.padding-y-md { padding-top: 0.5rem; padding-bottom: 0.5rem; }'
      )

      expect(css).toContain(
        '@media (min-width: 800px) { .md\\:padding-l-md { padding-left: 0.5rem; } }'
      )
      expect(css).toContain(
        '@media (min-width: 1200px) { .lg\\:padding-b-lg { padding-bottom: 1rem; } }'
      )
      expect(css).toContain(
        '@media (min-width: 1200px) { .lg\\:padding-y-lg { padding-top: 1rem; padding-bottom: 1rem; } }'
      )

      expect(css).toContain(
        '.hover\\:padding-r-lg:hover { padding-right: 1rem; }'
      )
      expect(css).toContain(
        '.hover\\:padding-b-md:hover { padding-bottom: 0.5rem; }'
      )
      expect(css).toContain(
        '.hover\\:padding-x-md:hover { padding-left: 0.5rem; padding-right: 0.5rem; }'
      )
    })

    it('generates a complex 2', () => {
      const config = `
utilities:
  background-color:
    alias: bg-color
    from:
      gray:
        100: '#f5f5f5'
        200: '#eeeeee'
        300: '#e0e0e0'
    pseudo: [focus]
    breakpoints: [lg]
    rotations: true
pseudo:
  hover: hover
  focus: focus
breakpoints:
  md: 800px
  lg: 1200px`

      css = generateUtilities(YAML.parse(config))

      expect(css).toContain('.bg-color-gray-100 { background-color: #f5f5f5; }')

      expect(css).not.toContain(
        '@media (min-width: 800) { .md\\:bg-color-gray-200 { background-color: #eeeeee; } }'
      )
      expect(css).toContain(
        '@media (min-width: 1200px) { .lg\\:bg-color-gray-200 { background-color: #eeeeee; } }'
      )
      expect(css).toContain(
        '.focus\\:bg-color-gray-300:focus { background-color: #e0e0e0; }'
      )
      expect(css).not.toContain(
        '.hover\\:bg-color-gray-300:hover { background-color: #e0e0e0; }'
      )
      expect(css).toContain(
        '.bg-color-l-gray-100 { background-color-left: #f5f5f5; }'
      )

      expect(css).toContain(
        '@media (min-width: 1200px) { .lg\\:bg-color-r-gray-200 { background-color-right: #eeeeee; } }'
      )
      expect(css).not.toContain(
        '@media (min-width: 800px) { .md\\:bg-color-r-gray-200 { background-color-right: #eeeeee; } }'
      )
      expect(css).toContain(
        '.focus\\:bg-color-t-gray-300:focus { background-color-top: #e0e0e0; }'
      )
      expect(css).not.toContain(
        '.hover\\:bg-color-t-gray-300:hover { background-color-top: #e0e0e0; }'
      )
    })

    it('can generate with option substitute=false', () => {
      const config = `
variables:
  clr:
    red: '#f00'
    green: '#0f0'
    blue: '#00f'
utilities:
  color:
    from: clr`

      css = generateUtilities(YAML.parse(config), false)

      expect(css).toContain(`.color-red { color: var(--clr-red); }`)
      expect(css).toContain(`.color-green { color: var(--clr-green); }`)
      expect(css).toContain(`.color-blue { color: var(--clr-blue); }`)
    })

    it('can generates utils with prefix with option substitute=false', () => {
      const config = `
variables:
  color:
    red: '#f00'
    green: '#0f0'
    blue: '#00f'
utilities:
  color:
    from: color
prefix: app`

      css = generateUtilities(YAML.parse(config), false)

      expect(css).toContain(`.app-color-red { color: var(--app-color-red); }`)
      expect(css).toContain(
        `.app-color-green { color: var(--app-color-green); }`
      )
      expect(css).toContain(`.app-color-blue { color: var(--app-color-blue); }`)
    })
  })

  describe('extras', () => {
    describe('stack/divide', () => {
      it('generates stack', () => {
        const config = `
extras:
  stack-y:
    from:
      md: 0.5rem
      lg: 1rem`

        const css = generateUtilities(YAML.parse(config))

        expect(css).toContain(`.stack-y-md > * { margin-bottom: 0; }`)
        expect(css).toContain(`.stack-y-md > *:first-child { margin-top: 0; }`)
        expect(css).toContain(`.stack-y-md > * + * { margin-top: 0.5rem; }`)
        expect(css).toContain(`.stack-y-lg > * { margin-bottom: 0; }`)
        expect(css).toContain(`.stack-y-lg > * + * { margin-top: 1rem; }`)
        expect(css).toContain(`.stack-y-lg > *:first-child { margin-top: 0; }`)
      })

      it('generates stack with prefix and !important', () => {
        const config = `
extras:
  stack-x:
    from:
      md: 0.5rem
      lg: 1rem
prefix: app
important: true`

        const css = generateUtilities(YAML.parse(config))

        expect(css).toContain(
          `.app-stack-x-md > * { margin-right: 0 !important; }`
        )
        expect(css).toContain(
          `.app-stack-x-md > *:first-child { margin-left: 0 !important; }`
        )
        expect(css).toContain(
          `.app-stack-x-md > * + * { margin-left: 0.5rem !important; }`
        )
        expect(css).toContain(
          `.app-stack-x-lg > * { margin-right: 0 !important; }`
        )
        expect(css).toContain(
          `.app-stack-x-lg > *:first-child { margin-left: 0 !important; }`
        )
        expect(css).toContain(
          `.app-stack-x-lg > * + * { margin-left: 1rem !important; }`
        )
      })

      it('generates stack from variables', () => {
        const config = `
variables:
  size:
    md: 0.5rem
    lg: 1rem
extras:
  divide-x:
      from: size`

        const css = generateUtilities(YAML.parse(config))

        expect(css).toContain(`.divide-x-md > * { border-right-width: 0; }`)
        expect(css).toContain(
          `.divide-x-md > *:first-child { border-left-width: 0; }`
        )
        expect(css).toContain(
          `.divide-x-md > * + * { border-left-width: 0.5rem; }`
        )
        expect(css).toContain(`.divide-x-lg > * { border-right-width: 0; }`)
        expect(css).toContain(
          `.divide-x-lg > *:first-child { border-left-width: 0; }`
        )
        expect(css).toContain(
          `.divide-x-lg > * + * { border-left-width: 1rem; }`
        )
      })
    })
  })
})

describe('sortFunc', () => {
  it('sorts media queries', () => {
    const lines = [
      '@media (min-width: 1000px) { .color-red { color: red; } }',
      '@media (min-width: 500px) { .color-red { color: red; } }',
      '.color-red { color: red; }',
    ]

    lines.sort(_sortFunc)

    expect(lines[0]).toEqual('.color-red { color: red; }')
    expect(lines[1]).toEqual(
      '@media (min-width: 500px) { .color-red { color: red; } }'
    )
    expect(lines[2]).toEqual(
      '@media (min-width: 1000px) { .color-red { color: red; } }'
    )
  })
})
