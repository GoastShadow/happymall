/*
 * @Author: Miss.chenfang 
 * @Date: 2019-06-03 15:02:39 
 * @Last Modified by: GoastShadow
 * @Last Modified time: 2019-06-07 19:53:30
 */

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量配置   开发环境 dev  /  线上环境  online
var WEBPACK_DEV = process.env.WEBPACK_DEV || 'dev';


// 这里是html-webpack-plugin参数的方法
var getHtml = function(name) {
    return {
        template: './src/view/' + name + '.html', // html原始的模板
        filename: './view/' + name + '.html', //  目标文件目录
        inject: true,
        hash: true, // 版本
        chunks: ['common', name] //  需要打包的模块  、文件夹
    };
}

// webpack config的配置
var config = {
    entry: {
        'common': ['./src/common/index.js'],
        'index': ['./src/page/index/index.js'],
        'login': ['./src/page/login/index.js']
    },
    output: {
        path: './dist',
        publicPath: '/dist',
        filename: 'js/[name].js'
    },
    module: {
        loaders: [{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader") //  这里的意思是如果探测到以.css为结尾的文件，就使用style-loader和css-loader
            },
            {
                test: /\.(jpg|gif|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=100&name=resource/[name].[ext]'
            }
        ]
    },
    externals: {
        'jquery': 'window.jQuery'
    },
    plugins: [ // 提取公共组件模块
        // 独立通用模块到dist/js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common', // 引入的公共模块文件夹名
            filename: 'js/base.js' // 输出的文件名，输出的位置是基于path的路径
        }),
        // 把css单独打包到文件 dist/css
        new ExtractTextPlugin('css/[name].css'),
        // html模板的处理    如果页面有很多的话，就要设置一个函数，来设置灵活的参数
        new HtmlWebpackPlugin(getHtml('index')),
        new HtmlWebpackPlugin(getHtml('login'))

    ]

}

if (WEBPACK_DEV === "dev") {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/')
}

module.exports = config;