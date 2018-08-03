const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack demo"
    })
  ],
  devServer: {
    // Display only errors to reduce the amount of output.
    stats: "errors-only",

    overlay: true,

    host: process.env.HOST, // Defaults to `localhost`
    port: process.env.PORT, // Defaults to 8080
    open: true // Open the page in browser
  }
};
