/**
 * Created by admin on 2021/2/8.
 * 消息接口
 */
const express = require("express");
const router = express.Router()
const database = require("../database/connect.js")
const resData = require("../utils/resData.js")
// 分页根据用户id查询历史消息
router.get("/list",function (req,res) {
    let {userId,targetId,pageNo,pageSize} = req.query
    let start = (pageNo-1) * pageSize
    let end = pageNo * pageSize
    let sql = "select m.*,u.headIcon,u.name from message m inner join `user` u on m.userId = u.id where m.userId=1 and m.targetId=2 or m.userId=2 and m.targetId=1 ORDER BY id desc LIMIT "+start+","+end+";"
    database.query("select count(1) from message m where m.userId=1 and m.targetId=2 or m.userId=2 and m.targetId=1").then(total=>{
        database.query(sql,[userId,targetId,targetId,userId]).then(data=>{
            res.send(resData({data:{list:data.reverse(),pageNo,pageSize,total:total[0]["count(1)"]}}))
        })
    })
})


// 添加消息
// 删除消息

module.exports = router