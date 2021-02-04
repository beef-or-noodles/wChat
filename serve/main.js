/**
 * Created by admin on 2021/2/3.
 * 模拟服务接口
 */
const express = require("express")
const app = express()
const bodyparser = require('body-parser')

var utils = require('./utils.js')

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
// 用户列表
app.get('/userList',(req,res,next)=>{
   // 用户数据
    const userList = utils.readJson('user.json')
    res.send(userList)
})
// 历史记录
app.get('/historyList',(req,res,next)=>{
    let arr = req.query.roomId.split(',')
    let list = []
    let jsonLIst = utils.readJson('data.json')
    jsonLIst.forEach(item=>{
        if((item.userId == arr[0] && item.targetId==arr[1]) || (item.userId == arr[1] && item.targetId==arr[0])){
            list.push(item)
        }
    })
    res.send(list)
})
// 登录接口
app.post('/login',(req,res,next)=>{
    let params = req.body
    let jsonLIst = utils.readJson('user.json')
    let userId = ''
    for (let i in jsonLIst){
        if(params.userName==jsonLIst[i].userName && params.password==jsonLIst[i].password ){
            userId = jsonLIst[i].userId
            break
        }
    }
    res.send({userId})
})
// 注册
app.post('/signin',(req,res,next)=>{
    let params = req.body
    let jsonLIst = utils.readJson('user.json')
    let userId = jsonLIst.length+1
    params['userId'] = userId
    jsonLIst.push(params)
    utils.saveJson(jsonLIst,'user')
    res.send({userId})
})


app.listen(8002,()=>{
    console.log("http://localhost:8002");
})