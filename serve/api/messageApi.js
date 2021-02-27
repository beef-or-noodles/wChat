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
    let sql = "select m.*,u.image,u.userName from message m inner join `userinfo` u on m.userId = u.id where m.userId="+userId+" and m.targetId="+targetId+" or m.userId="+targetId+" and m.targetId="+userId+" ORDER BY id desc LIMIT "+start+","+pageSize+";"
    database.query("select count(1) from message m where m.userId="+userId+" and m.targetId="+targetId+" or m.userId="+targetId+";").then(total=>{
        database.query(sql,[userId,targetId,targetId,userId]).then(data=>{
            res.send(resData({data:{list:data.reverse(),pageNo,pageSize,total:total[0]["count(1)"]}}))
        })
    })
})


// 添加消息
// 删除消息

module.exports = router