const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  return ({
    stats: 'minimal', 
    entry: './index.ts', 

   
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      // publicPath: './dist/'
    },

    
    devServer: {
      compress: true,
      allowedHosts: "all", 
      static: false,
      client: {
        logging: "warn",
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
      port: 1234, host: '0.0.0.0',
      headers: {
        'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'audio/mp3', // 或者 'audio/mp3'
      },
    },

    
    performance: { hints: false },

    devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,

    optimization: {
      minimize: argv.mode === 'production',
      minimizer: [new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: { drop_console: true },
          output: { comments: false, beautify: false },
        },
      })],
    },


    module: {
      rules: [
        {
          test: /\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            transpileOnly: true
          }
        },
      ]
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js',
      ]
    },

    plugins: [
      // Copy our static assets to the final build
      new CopyPlugin({
        patterns: [{ from: 'static/' }],
      }),

      // Make an index.html from the template
      new HtmlWebpackPlugin({
        template: 'index.ejs',
        hash: true,
        minify: false
      })
    ]
  });
}