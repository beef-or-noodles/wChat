/**
 * Created by admin on 2021/2/7.
 * 用户接口
 */
const express = require("express");
const router = express.Router()
const database = require("../database/connect.js")
const resData = require("../utils/resData.js")
const utils = require("../utils/utils")
// 用户注册 新增
// router.post("/add",function (req,res) {
//     let {name,password,headIcon,phone} = req.body
//     database.query('INSERT INTO user (`name`,`password`,headIcon,phone) VALUES (?,?,?,?);',[name,password,headIcon,phone]).then(data=>{
//         res.send(resData())
//     })
// })
// 用户列表查询查询
router.get("/list",function (req,res) {
    let userId = req.headers.userId
    database.query('select * from userinfo where id != ?;',[userId]).then(data=>{
        res.send(resData({data:{list:data}}))
    })
})
// 登录 查询
router.post("/login",function(req,res){
    let {name,password} = req.body
    database.query("select u.name,u.headIcon,u.id from userinfo u where userName=? and passWord=?",[name,password]).then(data=>{
        if(data.length){
            // 登录成功生成token
            let token = utils.Token.encrypt(data[0],"10d")
            res.send(resData({data:data[0],token,describe:"登录成功"}))
        }else{
            res.send(resData({code:500,describe:"账号或密码错误"}))
        }

    })
})

module.exports = router


