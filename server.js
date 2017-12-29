const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const bodyparser = require('koa-bodyparser')
const ctxCacheControl = require('koa-ctx-cache-control')
const koaWebpack = require('koa-webpack')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const lint = require('./controllers/lint')

const app = new Koa()
const router = new Router()

const compiler = webpack(webpackConfig)

const { NODE_ENV = 'development', PORT = 3000 } = process.env
const dev = 'production' !== NODE_ENV

ctxCacheControl(app)

router.post('/lint', lint.post)

if (dev) {
  app.use(logger())
  app.use(koaWebpack({
    compiler,
    config: webpackConfig,
    dev: {
      publicPath: webpackConfig.output.publicPath,
      historyApiFallback: true,
    }
  }))
}
app.use(bodyparser())
app.use(router.routes()).use(router.allowedMethods())
app.use(koaStatic(path.join(__dirname, 'public')))

// There is a problem when used in conjunction with `koa-webpack`
// app.use(compress())

app.listen(PORT, err => {
  if (err) throw err
  if (dev) {
    console.log(`> Ready on http://localhost:${PORT}`)
  }
})
