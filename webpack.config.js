const Packer = require('packer-webpack-plugin')

module.exports = {
  mode: "production",
  node: {
    fs: 'empty',
    net:'empty'
  },
  entry: './app.js', // the starting point for our program
  output: {
    path: __dirname, // the absolute path for the directory where we want the output to be placed
    filename: 'bundle.js' // the name of the file that will contain our output - we could name this whatever we want, but bundle.js is typical
  },
  plugins: [
    new Packer({ // Must be initialized per bundle
      blacklist: [/aws-sdk/], // Optional
      packageManager: 'npm'   // Optional
    }),
  ],
}
