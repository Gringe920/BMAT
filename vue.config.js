let appState = process.argv[4] === 'app';
process.env.appState = appState;
global.APP_STATE = appState;
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var plugins =[];
var optimization = {
    splitChunks : {
        cacheGroups: {
            commons: {
                test: /[\\/]node_modules[\\/](ripple|bip39|ripple-binary-codec|ripple-lib|lodash|sockjs-client|crypto-js|decimal\.js)[\\/]/,
                name: 'rcp',
                chunks: 'all'
            },
        }
    }
};
if(process.env.NODE_ENV === 'production'){
    console.log('=================production=====================');
}else{
    // plugins.push(new BundleAnalyzerPlugin());
}
module.exports = {
    configureWebpack: {
        optimization,
        plugins
    },
    publicPath: appState ? './static/' : process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: appState ? 'D:\\rcpApp\\adrApp\\static' : path.resolve(__dirname, "./dist"),
    assetsDir: appState ? "./" : "static",
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
    devServer: {
        port: 8888,
        proxy: {
            // '/service/price_info': {
            //     target: 'http://192.168.0.110:9002/',
            //     secure: false,
            //     changeOrigin: true,
            //     pathRewrite: {}
            // // },
            // '/service/quote': {
            //     target: 'https://trading.adrchain.org/',
            //     secure: false,
            //     changeOrigin: true,
            //     pathRewrite: {}
            // },
            // '/service/kline': {
            //     target: 'https://trading.adrchain.org/',
            //     secure: false,
            //     changeOrigin: true,
            //     pathRewrite: {}
            // },
            '/service': {
                // target: 'http://47.240.110.55:9003/',
                target: 'http://api.bmatoken.org/',
                secure: false,
                changeOrigin: true,
                pathRewrite: {}
            },
        }
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "~@/assets/css/config.scss";`
            },
        }
    },
    chainWebpack: config => {
        // config.plugin('html').tap(args => {
        //     // args[0].filename = "test.html";
        //     return args;
        // });

        if (appState) {
            config.plugin('html').tap(args => {
                args[0].filename = "D:\\rcpApp\\adrApp\\index.html";
                return args;
            });

            config.plugin('copy').tap(args => {
                args[0][0].ignore.push('app/*');
                args[0][0].ignore.push('pdf/*');
                return args;
            });
        }
    }
}