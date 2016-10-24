var path = require('path')
var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: "./lib/browser_reader.js",
  output: {
    path: "dist",
    filename: "flatbuffers_stream.js",
    libraryTarget: "umd",
    publicPath: "/dist/",
    library: "StreamableBuffers",
    umdNamedDefine: true,
  },
  module : {
    loaders: [ {
        test   : /.js$/,
        loader : 'babel-loader',
        exclude: /node_modules/,
        query  : {
          presets: ['es2015'],
          plugins: [
            'add-module-exports'
          ]
        }
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: [
    new WebpackNotifierPlugin(),
  ]
}
