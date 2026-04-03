import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
  entry: { index: './src/index.js' },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SINGLE_SECTION': JSON.stringify(process.env.SINGLE_SECTION || 'false'),
    }),
    new HtmlWebpackPlugin({
      favicon: './src/assets/favicon.ico',
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/robots.txt', to: 'robots.txt' },
      ],
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(import.meta.dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
