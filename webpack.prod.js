import TerserPlugin from 'terser-webpack-plugin';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          },
          mangle: true,
        },
        extractComments: false,
      }),
    ],
  },
});
