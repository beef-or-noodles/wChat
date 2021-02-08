/**
 * Created by admin on 2021/2/7.
 * 用户接口
 */
const express = require("express");
const router = express.Router()
const database = require("../database/connect.js")

router.get('/list',function(req,res){
    database.query('select * from user').then((data)=>{
        res.send(data)
    }).catch(err=>{
        console.log(err);
    })
})

// 用户注册 新增
router.post("/add",function (req,res) {
    let {name,password,headIcon,phone} = req.body
    database.query('INSERT INTO user (`name`,`password`,headIcon,phone) VALUES (?,?,?,?);',[name,password,headIcon,phone]).then(data=>{

    })
})
// 用户列表查询查询
router.get("/query",function (req,res) {
    database.query('select * from user').then(data=>{

    })
})
// 登录 查询

module.exports = router


