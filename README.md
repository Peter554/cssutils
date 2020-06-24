# cssutils

[![Build Status](https://travis-ci.org/Peter554/cssutils.svg?branch=master)](https://travis-ci.org/Peter554/cssutils)

`npm install -g @peter554/cssutils`

A CSS utility class generator. User friendly, simple, powerful. Inspired by [tailwindcss](https://github.com/tailwindcss/tailwindcss) and [gordon](https://github.com/hankchizljaw/goron).

## Example

`cssutils --nomin config.yml`

```yaml
# config.yml
variables:
    color:
        red: '#f00'
        green: '#0f0'
generate:
    color:
        from: color
    padding:
        alias: pad
        from:
            md: 0.5rem
            lg: 1rem
```

```css
:root {
    --color-red: #f00;
    --color-green: #0f0;
}

.color-red { color: #f00; }
.color-green { color: #0f0; }

.pad-md { padding: 0.5rem; }
.pad-lg { padding: 1rem; }
```

## Go further

Check out the tests -> [`generate.test.js`](https://github.com/Peter554/cssutils/blob/master/generate.test.js).

- Responsive selectors
- Pseudo selectors
- Rotations
- ...
