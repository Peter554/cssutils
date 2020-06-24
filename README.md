# cssutils

[![Build Status](https://travis-ci.org/Peter554/cssutils.svg?branch=master)](https://travis-ci.org/Peter554/cssutils)

`npm install -g @peter554/cssutils`

A CSS utility class generator. User friendly, simple, powerful. Inspired by [tailwindcss](https://github.com/tailwindcss/tailwindcss) and [gordon](https://github.com/hankchizljaw/goron).

## Basic example

`cssutils --nomin config.yml` (`--nomin` flag disables CSS minification/optimization).

```yaml
# config.yml
variables:
  color:
    red: '#f00'
    green: '#0f0'
  size:
    md: 0.5rem
    lg: 1rem
generate:
  color:
    from: color
  background-color:
    alias: bg-color
    from: color
    pseudo: [hover]
  padding:
    alias: pad
    from: size
    responsive: true
  margin:
    from:
      md: 0.25rem
    rotations: true
breakpoints:
  md: 800px
```

```css
:root { --color-green: #0f0; }
:root { --color-red: #f00; }
:root { --size-lg: 1rem; }
:root { --size-md: 0.5rem; }

.color-green { color: #0f0; }
.color-red { color: #f00; }

.bg-color-green { background-color: #0f0; }
.bg-color-red { background-color: #f00; }
.hover\:bg-color-green:hover { background-color: #0f0; }
.hover\:bg-color-red:hover { background-color: #f00; }

.pad-lg { padding: 1rem; }
.pad-md { padding: 0.5rem; }
@media (min-width: 800px) { .md\:pad-lg { padding: 1rem; } }
@media (min-width: 800px) { .md\:pad-md { padding: 0.5rem; } }

.margin-bottom-md { margin-bottom: 0.25rem; }
.margin-left-md { margin-left: 0.25rem; }
.margin-md { margin: 0.25rem; }
.margin-right-md { margin-right: 0.25rem; }
.margin-top-md { margin-top: 0.25rem; }
```

## Go further

Check out the tests -> [`generate.test.js`](https://github.com/Peter554/cssutils/blob/master/src/generate.test.js).

- Responsive selectors
- Pseudo selectors
- Rotations
- !important
- Prefix
- More...
