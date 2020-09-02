const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
   mode: "production",
 // mode: "development",
  node: {
    fs: 'empty',
    net:'empty'
  },
  ///// using the terser plugin
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 2016,
          parse: {},
          compress: {
            ecma:2016,
            toplevel:true,
            arguments:true,
            booleans_as_integers:true,
            drop_console:true,
            hoist_funs:true,
            keep_fargs:false,
            passes:3,
            pure_getters:true,
            unsafe:true,
            unsafe_Function:true,
            unsafe_arrows:true,
            unsafe_comps:true,
            unsafe_math:true,
            unsafe_methods:true,
            unsafe_proto:true,
            unsafe_regexp:true,
            unsafe_symbols:true,
            unsafe_undefined:true
          },
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ],
  },
  entry: './app.js', // the starting point for our program
  output: {
    path: __dirname, // the absolute path for the directory where we want the output to be placed
    filename: 'bundle.js' // the name of the file that will contain our output - we could name this whatever we want, but bundle.js is typical
  }
 }
