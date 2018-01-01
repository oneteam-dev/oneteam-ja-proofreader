const path = require('path')
const webpack = require('webpack')
const CommonShakePlugin = require('webpack-common-shake').Plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const dotenv = require('dotenv')

dotenv.config()

const { NODE_ENV = 'development' } = process.env
const prod = NODE_ENV === 'production'

const srcPath = path.resolve(__dirname, 'src')
const srcImagesPath = path.resolve(srcPath, 'images')
const buildPath = path.resolve(__dirname, 'public')
const nodeModulesPath = path.resolve(__dirname, 'node_modules')

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV),
    },
  }),
  new HtmlPlugin({
    template: path.resolve(__dirname, 'template', 'index.pug'),
    favicon:  path.resolve(srcImagesPath, 'favicon.ico'),
  }),
  new CaseSensitivePathsPlugin(),
]

const entry = [
  '@babel/polyfill',
  'isomorphic-fetch',
  path.resolve(srcPath, 'index.js'),
]

if (prod) {
  plugins.push(
    new CommonShakePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: { screw_ie8: true, warnings: false },
      mangle: { screw_ie8: true },
      output: { screw_ie8: true },
    }),
    new ExtractTextPlugin({
      filename: '[name]-[contenthash].css',
      allChunks: true,
      ignoreOrder: true,
    })
  )
} else {
  entry.push('react-hot-loader/patch', 'webpack-hot-middleware/client', entry.pop())
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}

const baseCSSLoaderOptions = { minimize: prod }

const srcCSSLoaderOptions = Object.assign(
  {},
  baseCSSLoaderOptions,
  {
    modules: true,
    importLoaders: 1,
    localIdentName: prod ? '[hash:base64:8]' : '[path][name]__[local]___[hash:base64:4]',
    camelCase: 'dashesOnly',
  }
)
const srcCSSRule = { test: /\.css$/, include: srcPath }
if (prod) {
  srcCSSRule.loader = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      { loader: 'css-loader', options: srcCSSLoaderOptions },
      'postcss-loader',
    ],
  })
} else {
  srcCSSRule.use = [
    'style-loader',
    { loader: 'css-loader', options: srcCSSLoaderOptions },
    'postcss-loader',
  ]
}

const libCSSLoaderOptions = Object.assign({}, baseCSSLoaderOptions)
const libCSSRule = { test: /\.css$/, include: [nodeModulesPath] }
if (prod) {
  libCSSRule.loader = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      { loader: 'css-loader', options: libCSSLoaderOptions },
    ],
  })
} else {
  libCSSRule.use = [
    'style-loader',
    { loader: 'css-loader', options: libCSSLoaderOptions },
  ]
}

module.exports = {
  devtool: false,
  entry: {
    app: entry,
  },
  plugins,
  output: {
    filename: `[name]${prod ? '-[chunkhash]' : ''}.js`,
    path: buildPath,
    publicPath: '/',
  },
  resolve: {
    modules: ['node_modules', srcPath],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [srcPath],
        loader: 'babel-loader',
        options: { cacheDirectory: true },
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      srcCSSRule,
      libCSSRule,
    ],
  },
}
