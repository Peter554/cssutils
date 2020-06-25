# cssutils

[![Build Status](https://travis-ci.org/Peter554/cssutils.svg?branch=master)](https://travis-ci.org/Peter554/cssutils)

`npm install -g @peter554/cssutils`

A CSS utility class generator. User friendly, simple, powerful. Inspired by [tailwindcss](https://github.com/tailwindcss/tailwindcss) and [gordon](https://github.com/hankchizljaw/goron).

## Example

`cssutils --nomin demo.yml` (`--nomin` flag disables CSS minification/optimization).

```yaml
# demo.yml
variables:
  color:
    red: '#f00'
    gray:
      light: '#ccc'
      dark: '#333'
  size:
    1: 0.25rem
    2: 0.5rem
generate:
  color:
    from: color
  background-color:
    alias: bgcolor
    from: color
    pseudo:
      hvr: hover
  padding:
    alias: p
    from: size
    responsive: true
  margin:
    alias: m
    from:
      1: 0.25rem
    rotations: true
breakpoints:
  md: 800px
```

```css
:root { --color-gray-dark: #333; }
:root { --color-gray-light: #ccc; }
:root { --color-red: #f00; }
:root { --size-1: 0.25rem; }
:root { --size-2: 0.5rem; }

.color-gray-dark { color: var(--color-gray-dark); }
.color-gray-light { color: var(--color-gray-light); }
.color-red { color: var(--color-red); }

.bgcolor-gray-dark { background-color: var(--color-gray-dark); }
.bgcolor-gray-light { background-color: var(--color-gray-light); }
.bgcolor-red { background-color: var(--color-red); }
.hvr\:bgcolor-gray-dark:hover { background-color: var(--color-gray-dark); }
.hvr\:bgcolor-gray-light:hover { background-color: var(--color-gray-light); }
.hvr\:bgcolor-red:hover { background-color: var(--color-red); }

.p-1 { padding: var(--size-1); }
.p-2 { padding: var(--size-2); }
@media (min-width: 800px) { .md\:p-1 { padding: var(--size-1); } }
@media (min-width: 800px) { .md\:p-2 { padding: var(--size-2); } }

.m-1 { margin: 0.25rem; }
.m-b-1 { margin-bottom: 0.25rem; }
.m-l-1 { margin-left: 0.25rem; }
.m-r-1 { margin-right: 0.25rem; }
.m-t-1 { margin-top: 0.25rem; }
.m-x-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
.m-y-1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }
```

## Go further

Check out the tests -> [`generate.test.js`](https://github.com/Peter554/cssutils/blob/master/src/generate.test.js).

- Responsive selectors
- Pseudo selectors
- Rotations
- !important
- Prefix
- More...
