const { TextLintEngine } = require('textlint')
const { createFormatter } = require('textlint-formatter')
const { isString } = require('lodash')

const textlint = new TextLintEngine()
const formatter = createFormatter({ formatterName: 'stylish' })

const lint = async (ctx, next) => {
  ctx.cacheControl(false)
  if (!ctx.request.body || !isString(ctx.request.body.text)) {
    ctx.throw(400, '`text` request body must be required.')
  } else {
    const result = await textlint.executeOnText(ctx.request.body.text)
    // TODO:
    const formatted = formatter(result)
      .split('\n')
      .filter(r => !/<text>/.test(r))
      .filter(r => !/Try to run: \$ /.test(r))
      .join('\n')
    ctx.body = { result: formatted }
  }
  await next()
}

module.exports.post = lint
