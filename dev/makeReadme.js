const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const YAML = require('yaml')
var toc = require('markdown-toc')

const { generate } = require('../src/generate')

const findStartIdx = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == '{% example %}') {
      return i
    }
  }
  return -1
}

const findEndIdx = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] == '{% endexample %}') {
      return i
    }
  }
  return -1
}

const processExample = (block) => {
  const lines = block.split('\n')
  const config = lines.slice(1, lines.length - 1).join('\n')
  const css = generate(YAML.parse(config))
  return `
${block}

\`\`\`css
${css}
\`\`\``.trim()
}

const main = () => {
  const templatePath = join(__dirname, 'README.template.md')
  const lines = readFileSync(templatePath, 'utf8').split('\n')

  while (true) {
    const startIdx = findStartIdx(lines)
    if (startIdx < 0) {
      break
    }
    const endIdx = findEndIdx(lines, startIdx)
    const block = lines.slice(startIdx + 1, endIdx).join('\n')

    const example = processExample(block)
    lines.splice(startIdx, endIdx - startIdx + 1, example)
  }

  const readme = toc.insert(lines.join('\n'))
  writeFileSync(join(__dirname, '../README.md'), readme)
}

main()
