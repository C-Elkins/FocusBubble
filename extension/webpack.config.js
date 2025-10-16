/**
 * Webpack Configuration for FocusBubble Extension
 *
 * Bundles multiple entry points:
 * - Background service worker (ES modules)
 * - Content script (injected into pages)
 * - Popup (vanilla JS)
 *
 * @author Chase Elkins
 */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'cheap-module-source-map',

    entry: {
      'background/service-worker': './background/service-worker.js',
      'content/content': './content/content.js',
      'popup/popup': './popup/popup.js',
      'dashboard/dashboard': './dashboard/dashboard.js'
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },

    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          // Copy manifest
          { from: 'manifest.json', to: 'manifest.json' },

          // Copy HTML files
          { from: 'popup/popup.html', to: 'popup/popup.html' },
          { from: 'dashboard/dashboard.html', to: 'dashboard/dashboard.html' },

          // Copy CSS files
          { from: 'content/bubble.css', to: 'content/bubble.css' },

          // Copy icons (if they exist)
          {
            from: 'icons',
            to: 'icons',
            noErrorOnMissing: true
          }
        ]
      })
    ],

    optimization: {
      minimize: isProduction,
      splitChunks: false
    },

    resolve: {
      extensions: ['.js'],
      alias: {
        '@shared': path.resolve(__dirname, 'shared')
      }
    }
  };
};
