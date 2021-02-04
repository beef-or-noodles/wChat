/**
 * Created by admin on 2021/2/4.
 */

//文件模块
let fs = require('fs');
//系统路径模块
let path = require('path');

function readJson(path){
    let rawdata = fs.readFileSync(path);
    let list = JSON.parse(rawdata.toString())
    return list
}
function saveJson(jsonData, fileName) {
// 格式化json
    let text = JSON.stringify(jsonData)
// 指定要创建的目录和文件名称 __dirname为执行当前js文件的目录
    let file = path.join('./', fileName + '.json');
    //写入文件
    fs.writeFile(file, text, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('文件创建成功~' + file);
        }
    });
}
module.exports = {
    readJson,
    saveJson
}