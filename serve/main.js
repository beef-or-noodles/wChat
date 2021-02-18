/**
 * Created by admin on 2021/2/3.
 * 模拟服务接口
 */
const express = require("express")
require('express-async-errors');
const app = express()
const bodyparser = require('body-parser')

const router = require("./api/index.js")

app.use(bodyparser.json(),bodyparser.urlencoded({extended:true}))

//设置跨域请求头  一个中间件设置跨域  主要是Access-Control-Allow-Origin字段 允许的访问源
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use("/wChat",router);
/* 全局错误抛出 */
app.use((error, req, res, next) => {
    if (error) {
        res.status(500).send(resData({code:500,describe:'服务器错误'}))
    }
});
app.listen(8002,()=>{
    console.log("http://localhost:8002");
})