/**
 * Created by admin on 2021/2/2.
 */

const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    devServer:{
        port:9000, // 启动端口
        open:true  // 启动后是否自动打开网页
    },
    chainWebpack: (config)=>{
        //修改文件引入自定义路径
        config.resolve.alias
            .set('@', resolve('src'))
            .set("@api",resolve("src/api/module"))
    }
}