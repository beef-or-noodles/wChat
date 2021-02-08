/**
 * Created by admin on 2021/2/8.
 * 消息接口
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
// 分页根据用户id查询历史消息
// 添加消息
// 删除消息

module.exports = router