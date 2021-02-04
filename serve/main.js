/**
 * Created by admin on 2021/2/3.
 * 模拟服务接口
 */
const express = require("express")
const app = express()
const bodyparser = require('body-parser')
//文件模块
let fs = require('fs');

app.use(bodyparser.json(),bodyparser.urlencoded({extended:true}))

const data = require("./data")

//设置跨域请求头  一个中间件设置跨域  主要是Access-Control-Allow-Origin字段 允许的访问源
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/userList',(req,res,next)=>{
   // 用户数据
    const userList = data.userList
    res.send(userList)
})

app.get('/historyList',(req,res,next)=>{
    let arr = req.query.roomId.split(',')
    let list = []
    let rawdata = fs.readFileSync('data.json');
    let jsonLIst = JSON.parse(rawdata.toString())
    jsonLIst.forEach(item=>{
        if((item.userId == arr[0] && item.targetId==arr[1]) || (item.userId == arr[1] && item.targetId==arr[0])){
            list.push(item)
        }
    })
    res.send(list)
})

app.listen(8002,()=>{
    console.log("http://localhost:8002");
})