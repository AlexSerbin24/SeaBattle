import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default {
    mode:"development",
    entry: "./src/index.tsx",
    output:{
        path:path.resolve(__dirname, "dist"),
        filename:"bundle.js"
    },

    resolve:{
        extensions:[".js",".jsx",".ts",".tsx"]
    },

    module:{
        rules:[
            {
                test:/\.(ts|tsx)$/,
                exclude:/node_modules/,
                use:"ts-loader"
            },
            {
                test:/\.(js|jsx)$/,
                exclude: /node_modules/,
                use:"babel-loader"
            }
        ]

    },

    plugins:[
        new HtmlWebpackPlugin({
            template:"./src/index.html"
        })
    ],

    devServer:{
        static:{
            directory:path.join(__dirname,"dist")
        },
        port:3000,
        hot:true
    }

}