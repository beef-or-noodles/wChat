/**
 * Created by admin on 2021/2/4.
 */

//文件模块
let fs = require('fs');
//系统路径模块
let path = require('path');

/*token生成验证*/
let jwt = require("jsonwebtoken")

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
const Token = {
    // 生成token
    encrypt:function(data,time="1d"){
       return jwt.sign({data}, 'token', {expiresIn:time})
    },
    // 解密token数据
    decrypt:function(token){
        try {
            let data = jwt.verify(token, 'token');
            return {
                token:true,
                data:data.data
            };
        } catch (e) {
            return {
                token:false,
                data:e
            }
        }
    }
}
// 验证token

module.exports = {
    readJson,
    saveJson,
    Token
}