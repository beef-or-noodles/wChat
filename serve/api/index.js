/**
 * Created by admin on 2021/2/7.
 * 公共路由文件
 */
const express = require("express");
const router = express.Router()
const user = require("./userApi.js")
const message = require("./messageApi.js")
const resData = require("../utils/resData.js")
const utils = require("../utils/utils")
const config = require("../utils/config")
/* 路由中间件 */
router.use(function(req, res, next) {
    // .. some logic here .. like any other middleware
    // 不需要登录的接口
    if(config.loginApi.includes(req.url)){
        next()
    }else{
        let token = req.headers.token
        let tokenData = utils.Token.decrypt(token)
        if(tokenData.token){
            req.headers['userId'] = tokenData.data.id
            next();
        }else{
            res.send(resData({code:3000,describe:'请先登录'}))
        }
    }

});
router.use('/user',user)
router.use('/message',message)
module.exports = router
