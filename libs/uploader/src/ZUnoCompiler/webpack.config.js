const path = require('path');

module.exports = {
  entry: './src/z-uno-compiler.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'ZUnoCompiler.js',
    libraryTarget: 'umd',
    library: 'ZUnoCompiler',
    path: path.resolve(__dirname, 'dist')
  }
};