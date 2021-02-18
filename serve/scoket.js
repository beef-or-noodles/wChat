/**
 * Created by admin on 2021/2/3.
 * node 服务文件
 */
var ws = require('nodejs-websocket')
const database = require("./database/connect.js")
var server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        let message = JSON.parse(str)
        if(message.hasOwnProperty("type")&&message.type=="heartbeat"){
            // 返回心跳数据
            conn.sendText(JSON.stringify(message))
        }else{
            //读取json聊天数据
            let targetId = message.targetId // 目标发送用户
            let handleResult = {
                handleResult:message
            }
            //返回给所有客户端的数据(相当于公告、通知)
            let targetOff = true // 目标用户是否在线 不在就只存数据库
            server.connections.forEach(function (conn) {
                if(targetId == strPath(conn.path).userId){ // 发送给目标用户在线
                    targetOff = false
                    saveMessage(message,()=>{
                        conn.sendText(JSON.stringify(handleResult))
                    })
                }
            })
            if(targetOff){
                saveMessage(message,()=>{})
            }
        }
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
    conn.on("error",() => {
        console.log('服务异常关闭...')
    })
}).listen(8001)

/* 存入聊天数据 */
function saveMessage(message,fc) {
    let {targetId,userId,text,type} = message
    database.query("insert into message (targetId,userId,text,type) values (?,?,?,?)",[targetId,userId,text,type]).then(res=>{
        fc()
    })
}


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
