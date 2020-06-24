# cssutils

[![Build Status](https://travis-ci.org/Peter554/cssutils.svg?branch=master)](https://travis-ci.org/Peter554/cssutils)

`npm install -g @peter554/cssutils`

A CSS utility class generator. User friendly, simple, powerful. Inspired by [tailwindcss](https://github.com/tailwindcss/tailwindcss) and [gordon](https://github.com/hankchizljaw/goron).

<!-- toc -->

- [Usage](#usage)
  * [Custom properties](#custom-properties)
  * [Utility classes](#utility-classes)
  * [Responsive utility classes](#responsive-utility-classes)
  * [Pseudo utility classes](#pseudo-utility-classes)
  * [Rotations](#rotations)
  * [Custom property substitution](#custom-property-substitution)
  * [Themes](#themes)
  * [!important & prefix](#important--prefix)
- [More features & examples](#more-features--examples)

<!-- tocstop -->

## Usage

- `cssutils --help`
- `cssutils --config config.yml --nomin`

Configuration file (YAML or JSON) is specified by the option `--config`, or discovered via [cosmiconfig](https://github.com/davidtheclark/cosmiconfig).

`--nomin` flag disables CSS minification/optimization.

CSS is written to stdout, or the location specified by the `--output` option.

### Custom properties

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

### Utility classes

Utility classes may be generated from variables:

```yml
variables:
  color:
    red: '#f00'
    green: '#0f0'
generate:
  background-color:
    alias: bgclr
    from: color
```

```css
:root { --color-green: #0f0; }
:root { --color-red: #f00; }

.bgclr-green { background-color: #0f0; }
.bgclr-red { background-color: #f00; }
```

By default custom properties are generated. We can disable this by setting `customproperties: false`.

```yml
variables:
  color:
    red: '#f00'
    green: '#0f0'
generate:
  background-color:
    alias: bgclr
    from: color
customproperties: false
```

```css
.bgclr-green { background-color: #0f0; }
.bgclr-red { background-color: #f00; }
```

We can also generate utility classes from their "own" data:

```yml
generate:
  background-color:
    alias: bgclr
    from:
      red: '#f00'
      green: '#0f0'
  padding:
    from:
      0: 0
      1: 0.25rem
```

```css
.bgclr-green { background-color: #0f0; }
.bgclr-red { background-color: #f00; }

.padding-0 { padding: 0; }
.padding-1 { padding: 0.25rem; }
```

### Responsive utility classes

```yml
generate:
  background-color:
    alias: bgclr
    from:
      red: '#f00'
    breakpoints: true
breakpoints:
  md: 800px
  lg: 1200px
```

```css
.bgclr-red { background-color: #f00; }
@media (min-width: 800px) { .md\:bgclr-red { background-color: #f00; } }
@media (min-width: 1200px) { .lg\:bgclr-red { background-color: #f00; } }
```

### Pseudo utility classes

```yml
generate:
  background-color:
    alias: bgclr
    from:
      red: '#f00'
    pseudo: true
pseudo:
  hcs: [hover, focus]
```

```css
.bgclr-red { background-color: #f00; }
.hcs\:bgclr-red:hover { background-color: #f00; }
.hcs\:bgclr-red:focus { background-color: #f00; }
```

### Rotations

```yml
generate:
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

### Custom property substitution

By default custom properties are substituted into utility classes. This can be disabled.

```yml
variables:
  color:
    red: '#f00'
    green: '#0f0'
generate:
  background-color:
    alias: bgclr
    from: color
substitute: false
```

```css
:root { --color-green: #0f0; }
:root { --color-red: #f00; }

.bgclr-green { background-color: var(--color-green); }
.bgclr-red { background-color: var(--color-red); }
```

### Themes

(Consider using together with option `substitute: false`)

```yml
variables:
  color:
    text: black
    background: white
themes:
  dark:
   color:
    text: white
    background: black
```

```css
:root { --color-background: white; }
:root { --color-text: black; }

.theme-dark { --color-background: black; }
.theme-dark { --color-text: white; }
```

### !important & prefix

```yml
variables:
  color:
    red: '#f00'
    green: '#0f0'
generate:
  background-color:
    alias: bgclr
    from: color
prefix: app
important: true
```

```css
:root { --app-color-green: #0f0; }
:root { --app-color-red: #f00; }

.app-bgclr-green { background-color: #0f0 !important; }
.app-bgclr-red { background-color: #f00 !important; }
```

## More features & examples

- Check out a more complete example -> [example](https://github.com/Peter554/cssutils/blob/master/example).

- Check out the tests -> [`generate.test.js`](https://github.com/Peter554/cssutils/blob/master/src/generate.test.js).
