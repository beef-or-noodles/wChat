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
     console.log('有一名用户连接进来了...')
    conn.on("text", function (str) {
        console.log('我来接收客户端发过来的消息' + str)
        let message = JSON.parse(str)
        if(message.hasOwnProperty("type")&&message.type=="heartbeat"){
            // 返回心跳数据
            conn.sendText(JSON.stringify(message))
        }else{
            let handleResult = {
                handleResult:message
            }
            console.log(server.connections);
            //返回给所有客户端的数据(相当于公告、通知)
            server.connections.forEach(function (conn) {
                conn.sendText(JSON.stringify(handleResult))
                console.log("返回消息");
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
console.log("ws://localhost:8001");
