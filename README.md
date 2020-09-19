# cssutils

![CI](https://github.com/Peter554/cssutils/workflows/CI/badge.svg)

`npm install --save-dev @peter554/cssutils`

A CSS utility class generator. User friendly, simple, powerful. Inspired by [tailwindcss](https://github.com/tailwindcss/tailwindcss) and [gordon](https://github.com/hankchizljaw/goron).

## Usage

- `cssutils --help` (CLI)
- `const cssutils = require("@peter554/cssutils")` (API)
- Check out the tests for the full features.

### CSS variables

- `cssutils variables --config ./config.yml`
- `cssutils.variables({configPath: "./config.yml"})`

```yml
variables:
  color:
    red: '#f00'
    green: '#0f0'
    grey:
      light: '#eee'
      mid: '#999'
```

```css
:root { --color-green: #0f0; }
:root { --color-grey-light: #eee; }
:root { --color-grey-mid: #999; }
:root { --color-red: #f00; }
```

### SASS/SCSS variables

- `cssutils sassvariables --config ./config.yml`
- `cssutils.sassVariables({configPath: "./config.yml"})`

```yml
variables:
  color:
    red: '#f00'
    green: '#0f0'
    grey:
      light: '#eee'
      mid: '#999'
```

```scss
$color-green: #0f0;
$color-grey-light: #eee;
$color-grey-mid: #999;
$color-red: #f00;
```

### Utility classes

- `cssutils utilities --config ./config.yml`
- `cssutils.utilities({configPath: "./config.yml"})`

```yml
variables:
  color:
    red: '#f00'
    green: '#0f0'
utilities:
  background-color:
    alias: bgclr
    from: color
  padding:
    alias: p
    from:
      0: 0
      1: 0.25rem
```

```css
.bgclr-green { background-color: #0f0; }
.bgclr-red { background-color: #f00; }

.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
```

#### Responsive utility classes

```yml
utilities:
  background-color:
    alias: bgclr
    from:
      red: '#f00'
    breakpoints: [md, lg]
breakpoints:
  md: 800px
  lg: 1200px
  xl: 1600px
```

```css
.bgclr-red { background-color: #f00; }
@media (min-width: 800px) { .md\:bgclr-red { background-color: #f00; } }
@media (min-width: 1200px) { .lg\:bgclr-red { background-color: #f00; } }
```

#### Pseudo utility classes

```yml
utilities:
  background-color:
    alias: bgclr
    from:
      red: '#f00'
    pseudo: [hcs]
pseudo:
  hcs: [hover, focus]
  act: [active]
```

```css
.bgclr-red { background-color: #f00; }
.hcs\:bgclr-red:hover { background-color: #f00; }
.hcs\:bgclr-red:focus { background-color: #f00; }
```

#### Rotations

```yml
utilities:
  padding:
    alias: pad
    from:
      1: 0.25rem
    rotations: true
```

```css
.pad-1 { padding: 0.25rem; }
.pad-b-1 { padding-bottom: 0.25rem; }
.pad-l-1 { padding-left: 0.25rem; }
.pad-r-1 { padding-right: 0.25rem; }
.pad-t-1 { padding-top: 0.25rem; }
.pad-x-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
.pad-y-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
```
