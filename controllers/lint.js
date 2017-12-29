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
    ctx.body = { result: formatter(result) }
  }
  await next()
}

module.exports.post = lint
