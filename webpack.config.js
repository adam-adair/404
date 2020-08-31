const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "production",
  //mode: "development",
  node: {
    fs: 'empty',
    net:'empty'
  },
  ///// using the terser plugin
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  entry: './app.js', // the starting point for our program
  output: {
    path: __dirname, // the absolute path for the directory where we want the output to be placed
    filename: 'bundle.js' // the name of the file that will contain our output - we could name this whatever we want, but bundle.js is typical
  }
 }
