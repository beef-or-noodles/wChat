/**
 * Created by admin on 2021/2/3.
 * 模拟服务接口
 */
const express = require("express")
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json(),bodyparser.urlencoded({extended:true}))

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
    console.log("get => userList");
   // 用户数据
    const userList = [{
        userId:1,
        userName:'吴万强',
        headIcon:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3250602694,1048058176&fm=26&gp=0.jpg',
    },{
        userId:2,
        userName:'小小只',
        headIcon:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3755467654,3504056667&fm=26&gp=0.jpg',
    }]
    res.send(userList)
})
app.listen(8002,()=>{
    console.log("http://10.0.0.53:8002");
})