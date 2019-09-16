const withCSS = require('@zeit/next-css')
module.exports = withCSS({
  webpack: (config, { dev }) => {
    config.module.rules.push({ test: /\.scss$/, loader: ['style-loader', 'css-loader', 'sass-loader'] });
    return config;
  },
  cssModules: true,
  distDir: process.env.NODE_ENV === 'production' ? `../functions/public` : '.next',
})
