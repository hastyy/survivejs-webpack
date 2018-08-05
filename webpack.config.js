const path = require("path");
const glob = require("glob");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const parts = require("./webpack.parts");

const PATHS = {
    app: path.join(__dirname, "src"),
};

const commonConfig = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo"
      })
    ]
  },
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  {
    output: {
      chunkFilename: "chunk.[id].js"
    }
  },
  parts.generateSourceMaps({ type: "hidden-source-map" }),
  parts.extractCSS({
    use: [
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          plugins: () => [require("autoprefixer")]
        }
      },
      "sass-loader"
    ]
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true })
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: "[name].[ext]"
    }
  }),
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial"
          }
        }
      }
    }
  }
]);

const developmentConfig = merge([
  parts.loadCSS(),
  parts.loadImages(),
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT
  })
]);

module.exports = (mode) => {
    if (mode === "production") {
        return merge(commonConfig, productionConfig, { mode });
    }

    return merge(commonConfig, developmentConfig, { mode });
};
