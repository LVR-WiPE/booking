const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const  isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization =() => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    }
    if (isProd) {
        config.minimizer = [
            new TerserPlugin()
        ]
    }
    return config
}


module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: 'development',
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        clean: true
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: isDev,
        port: 1507,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    optimization: optimization(),
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext][query]'
                }
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.pug$/,
                use: 'pug-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: 'index.pug',
                filename: './index.html',
                inject: true,
                minify: {
                    collapseWhitespace: isProd
                }
            }
        ),
        new MiniCssExtractPlugin(
            {
                filename: '[name].[contenthash].css'
            }
        ),
        new webpack.HotModuleReplacementPlugin()
    ]
}