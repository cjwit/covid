const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      }
    ]
  },
  entry: './script.js',
  output: {
    filename: './assets/script.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  watch: true,
};