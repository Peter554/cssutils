# cssutils

[![Build Status](https://travis-ci.org/Peter554/cssutils.svg?branch=master)](https://travis-ci.org/Peter554/cssutils)

`npm install -g @peter554/cssutils`

A CSS utility class generator. User friendly, simple, powerful. Inspired by [tailwindcss](https://github.com/tailwindcss/tailwindcss) and [gordon](https://github.com/hankchizljaw/goron).

<!-- toc -->
<!-- tocstop -->

## Usage

- `cssutils --help`
- `cssutils --config config.yml --nomin`

Configuration file (YAML or JSON) is specified by the option `--config`, or discovered via [cosmiconfig](https://github.com/davidtheclark/cosmiconfig).

`--nomin` flag disables CSS minification/optimization.

CSS is written to stdout, or the location specified by the `--output` option.

### Custom properties

{% example %}
```yml
variables:
  color:
    red: '#f00'
    green: '#0f0'
    grey:
      light: '#eee'
      mid: '#999'
```
{% endexample %}

### Utility classes

Utility classes may be generated from variables:

{% example %}
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
{% endexample %}

By default custom properties are generated. We can disable this by setting `customproperties: false`.

{% example %}
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
{% endexample %}

We can also generate utility classes from their "own" data:

{% example %}
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
{% endexample %}

### Responsive utility classes

{% example %}
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
{% endexample %}

### Pseudo utility classes

{% example %}
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
{% endexample %}

### Rotations

{% example %}
```yml
generate:
  padding:
    alias: pad
    from:
      1: 0.25rem
    rotations: true
```
{% endexample %}

### Custom property substitution

By default custom properties are substituted into utility classes. This can be disabled.

{% example %}
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
{% endexample %}

### Themes

(Consider using together with option `substitute: false`)

{% example %}
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
{% endexample %}

### !important & prefix

{% example %}
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
{% endexample %}

## More features & examples

- Check out a more complete example -> [example](https://github.com/Peter554/cssutils/blob/master/example).

- Check out the tests -> [`generate.test.js`](https://github.com/Peter554/cssutils/blob/master/src/generate.test.js).
