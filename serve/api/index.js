/**
 * Created by admin on 2021/2/7.
 * 公共路由文件
 */
const express = require("express");
const router = express.Router()
const user = require("./userApi.js")
const message = require("./messageApi.js")
router.use('/user',user)
router.use('/message',message)
module.exports = router
