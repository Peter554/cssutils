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

      expect(css).toContain(':root { --color-red: #f00; }')
      expect(css).toContain(':root { --color-green: #0f0; }')
      expect(css).toContain(':root { --color-blue: #00f; }')
    })

    it('generates variables with prefix', () => {
      const config = `
variables:
  color:
    red: '#f00'
    green: '#0f0'
    blue: '#00f'
prefix: app`

      css = generate(YAML.parse(config))

      expect(css).toContain(':root { --app-color-red: #f00; }')
      expect(css).toContain(':root { --app-color-green: #0f0; }')
      expect(css).toContain(':root { --app-color-blue: #00f; }')
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

      expect(css).toContain(':root { --color-gray-100: #f5f5f5; }')
      expect(css).toContain(':root { --color-gray-200: #eeeeee; }')
      expect(css).toContain(':root { --color-gray-300: #e0e0e0; }')
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

    it('generates utils with prefix', () => {
      const config = `
generate:
  color:
    from:
      red: '#f00'
      green: '#0f0'
      blue: '#00f'
prefix: app`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.app-color-red { color: #f00; }`)
      expect(css).toContain(`.app-color-green { color: #0f0; }`)
      expect(css).toContain(`.app-color-blue { color: #00f; }`)
    })

    it('generates utils with !important', () => {
      const config = `
generate:
  color:
    from:
      red: '#f00'
      green: '#0f0'
      blue: '#00f'
important: true`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.color-red { color: #f00 !important; }`)
      expect(css).toContain(`.color-green { color: #0f0 !important; }`)
      expect(css).toContain(`.color-blue { color: #00f !important; }`)
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

    it('generates responsive utils from variables', () => {
      const config = `
variables:
  breakpoint:
    md: 800px
    lg: 1200px
generate:
  color:
    from:
        red: '#f00'
        green: '#0f0'
    responsive: true
breakpoints: breakpoint`

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
    pseudo:
      hvr: hover
      fcs: [focus]
      act: [hover, focus, active]`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.hvr\\:color-red:hover { color: #f00; }`)
      expect(css).toContain(`.fcs\\:color-red:focus { color: #f00; }`)

      expect(css).toContain(`.hvr\\:color-green:hover { color: #0f0; }`)
      expect(css).toContain(`.fcs\\:color-green:focus { color: #0f0; }`)

      expect(css).toContain(`.act\\:color-red:hover { color: #f00; }`)
      expect(css).toContain(`.act\\:color-red:focus { color: #f00; }`)
      expect(css).toContain(`.act\\:color-red:active { color: #f00; }`)
      expect(css).toContain(`.act\\:color-green:hover { color: #0f0; }`)
      expect(css).toContain(`.act\\:color-green:focus { color: #0f0; }`)
      expect(css).toContain(`.act\\:color-green:active { color: #0f0; }`)
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

    it('generates utils with alsofrom', () => {
      const config = `
variables:
  color:
    red: '#f00'
    gray:
      100: '#f5f5f5'
      200: '#eeeeee'
      300: '#e0e0e0'
generate:
  color:
    from: color
    alsofrom:
      green: '#0f0'
      blue: '#00f'`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.color-red { color: #f00; }`)
      expect(css).toContain(`.color-green { color: #0f0; }`)
      expect(css).toContain(`.color-blue { color: #00f; }`)
      expect(css).toContain(`.color-gray-100 { color: #f5f5f5; }`)
      expect(css).toContain(`.color-gray-200 { color: #eeeeee; }`)
      expect(css).toContain(`.color-gray-300 { color: #e0e0e0; }`)
    })

    it('generates a complex util', () => {
      const config = `
generate:
  padding:
    from:
      md: 0.5rem
      lg: 1rem
    responsive: true
    pseudo:
      hover: hover
      focus: [focus]
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
    pseudo:
      hover: hover
      focus: focus
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
        '.bg-color-l-gray-100 { background-color-left: #f5f5f5; }'
      )

      expect(css).toContain(
        '@media (min-width: 1200px) { .lg\\:bg-color-r-gray-200 { background-color-right: #eeeeee; } }'
      )
      expect(css).toContain(
        '.hover\\:bg-color-t-gray-300:hover { background-color-top: #e0e0e0; }'
      )
    })

    it('can generate with option usevariables', () => {
      const config = `
variables:
  clr:
    red: '#f00'
    green: '#0f0'
    blue: '#00f'
generate:
  color:
    from: clr
usevariables: true`

      css = generate(YAML.parse(config))

      expect(css).toContain(`.color-red { color: var(--clr-red); }`)
      expect(css).toContain(`.color-green { color: var(--clr-green); }`)
      expect(css).toContain(`.color-blue { color: var(--clr-blue); }`)      
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

        const css = generate(YAML.parse(config))

        expect(css).toContain(`.stack-y-md > * { margin-bottom: 0; margin-top: 0; }`)
        expect(css).toContain(`.stack-y-md > * + * { margin-top: 0.5rem; }`)
        expect(css).toContain(`.stack-y-lg > * { margin-bottom: 0; margin-top: 0; }`)
        expect(css).toContain(`.stack-y-lg > * + * { margin-top: 1rem; }`)
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

        const css = generate(YAML.parse(config))

        expect(css).toContain(
          `.app-stack-x-md > * { margin-right: 0 !important; margin-left: 0 !important; }`
        )
        expect(css).toContain(
          `.app-stack-x-md > * + * { margin-left: 0.5rem !important; }`
        )
        expect(css).toContain(
          `.app-stack-x-lg > * { margin-right: 0 !important; margin-left: 0 !important; }`
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

        const css = generate(YAML.parse(config))

        expect(css).toContain(`.divide-x-md > * { border-right-width: 0; border-left-width: 0; }`)
        expect(css).toContain(
          `.divide-x-md > * + * { border-left-width: 0.5rem; }`
        )
        expect(css).toContain(`.divide-x-lg > * { border-right-width: 0; border-left-width: 0; }`)
        expect(css).toContain(
          `.divide-x-lg > * + * { border-left-width: 1rem; }`
        )
      })

      it('generates stack with alsofrom', () => {
        const config = `
variables:
  size:
    md: 0.5rem
    lg: 1rem
extras:
  divide-y:
      from: size
      alsofrom:
        sm: 0.25rem`

        const css = generate(YAML.parse(config))

        expect(css).toContain(`.divide-y-sm > * { border-bottom-width: 0; border-top-width: 0; }`)
        expect(css).toContain(
          `.divide-y-sm > * + * { border-top-width: 0.25rem; }`
        )
        expect(css).toContain(`.divide-y-md > * { border-bottom-width: 0; border-top-width: 0; }`)
        expect(css).toContain(
          `.divide-y-md > * + * { border-top-width: 0.5rem; }`
        )
        expect(css).toContain(`.divide-y-lg > * { border-bottom-width: 0; border-top-width: 0; }`)
        expect(css).toContain(
          `.divide-y-lg > * + * { border-top-width: 1rem; }`
        )
      })
    })
  })
})
