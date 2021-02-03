/**
 * Created by admin on 2021/2/3.
 * node 服务文件
 */

// 写死用户
const userList = [{
    userId:1,
    userName:'吴万强',
    headIcon:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3250602694,1048058176&fm=26&gp=0.jpg',
},{
    userId:2,
    userName:'小小只',
    headIcon:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3755467654,3504056667&fm=26&gp=0.jpg',
}]

var ws = require('nodejs-websocket')
var server = ws.createServer(function (conn) {
    let params = strPath(conn.path) // 接收数据
    let filterArr = userList.filter(ls=>ls.userId==params.userId)
    let userInfo = filterArr[0]
    console.log('连接用户-',userInfo.userName)
    conn.on("text", function (str) {
        let message = JSON.parse(str)
        if(message.hasOwnProperty("type")&&message.type=="heartbeat"){
            // 返回心跳数据
            conn.sendText(JSON.stringify(message))
        }else{
            let handleResult = {
                handleResult:message
            }
            let targetId = message.targetId // 目标发送用户
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
