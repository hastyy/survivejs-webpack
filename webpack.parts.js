const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require(
    "optimize-css-assets-webpack-plugin"
);
const cssnano = require("cssnano");

exports.minifyCSS = ({ options }) => ({
    plugins: [
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: options,
            canPrint: false,
        }),
    ],
});

exports.minifyJavaScript = () => ({
    optimization: {
        minimizer: [new UglifyWebpackPlugin({ sourceMap: true })],
    },
});

exports.clean = path => ({
    plugins: [new CleanWebpackPlugin([path])],
});

exports.attachRevision = () => ({
    plugins: [
        new webpack.BannerPlugin({
            banner: new GitRevisionPlugin().version(),
        }),
    ],
});

exports.purifyCSS = ({ paths }) => ({
    plugins: [new PurifyCSSPlugin({ paths })],
});

exports.extractCSS = ({ include, exclude, use = [] }) => {
    // Output extracted CSS to a file
    const plugin = new MiniCssExtractPlugin({
        filename: "[name].css",
    });

    return {
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    include,
                    exclude,

                    use: [
                        MiniCssExtractPlugin.loader,
                    ].concat(use),
                },
            ],
        },
        plugins: [plugin],
    };
};

exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.s?css$/,
                include,
                exclude,

                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [require("autoprefixer")]
                        }
                    },
                    "sass-loader"
                ]
            }
        ]
    }
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                include,
                exclude,
                use: {
                    loader: "url-loader",
                    options,
                },
            },
        ],
    },
});

exports.loadJavaScript = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,
                use: "babel-loader",
            },
        ],
    },
});

exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        stats: "errors-only",
        host, // Defaults to `localhost`
        port, // Defaults to 8080
        open: true,
        overlay: true,
    },
});

exports.generateSourceMaps = ({ type }) => ({
    devtool: type,
});
