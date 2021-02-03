/**
 * Created by admin on 2021/2/3.
 * node 服务文件
 */
const data = require("./data.js")
var ws = require('nodejs-websocket')
var server = ws.createServer(function (conn) {
    let params = strPath(conn.path) // 接收数据
    let filterArr = data.userList.filter(ls=>ls.userId==params.userId)
    let userInfo = filterArr[0]
    console.log('连接用户-',userInfo.userName)
    conn.on("text", function (str) {
        let message = JSON.parse(str)
        if(message.hasOwnProperty("type")&&message.type=="heartbeat"){
            // 返回心跳数据
            conn.sendText(JSON.stringify(message))
        }else{
            let targetId = message.targetId // 目标发送用户
            let handleResult = {
                handleResult:message
            }
            //返回给所有客户端的数据(相当于公告、通知)
            server.connections.forEach(function (conn) {
               if(targetId == strPath(conn.path).userId){ // 发送给目标用户
                   conn.sendText(JSON.stringify(handleResult))
               }
            })
        }
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
    conn.on("error",() => {
        console.log('服务异常关闭...')
    })
}).listen(8001)

/* 截取链接参数 */
function strPath(path){
    try {
        let obj = {}
        let str = path.substring(2,path.length)
        let a1 = str.split('&')
        for(let i in a1){
            let s1 = a1[i].split('=')
            obj[s1[0]] = s1[1].toString()
        }
        return obj
    }catch (e) {
        return {}
    }

    return obj
}

console.log("ws://localhost:8001");
