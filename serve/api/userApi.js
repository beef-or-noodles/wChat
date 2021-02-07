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
module.exports = router


