/* eslint-disable import/no-extraneous-dependencies */
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      '...', // Keep default minimizers
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.* statements
          },
        },
      }),
    ],
  },
});
