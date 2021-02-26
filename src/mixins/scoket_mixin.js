/**
 * Created by HIAPAD on 2020/4/21.
 * onMessage(data){} // 外部使用onMessage方法接收数据 接收到数据会触发这个方法
 * sendMessage(data){} // 外部使用sendMessage方法发送数据 发送数据
 */
export default {
    data() {
        return {
            websock: null,
            reconnectData: null,
            lockReconnect: false, // 避免重复连接，因为onerror之后会立即触发 onclose
            timeout: 30000, // 10s一次心跳检测
            timeoutObj: null,
            serverTimeoutObj: null,
            cleartimeout: null // 连接失败定时器
        }
    },
    mounted(){
        this.initWebSocket()
    },
    unmounted() {
        try{
            this.exit()
        }catch (e) {}
    },
    methods: {
        initWebSocket() {
            let userId = this.userId
            if (!userId) {
                console.log("没获取userID");
                return
            }
            let url = `ws://39.99.193.63:9001?userId=${userId}`
            console.log("初始化",url);
            if ('WebSocket' in window) {
            } else {
                return
            }
            const wsurl = `${url}`
            this.websock = new WebSocket(wsurl)
            this.websock.onopen = this.websocketonopen // 连接成功
            this.websock.onmessage = this.websocketonmessage // 广播成功
            this.websock.onerror = this.websocketonerror // 连接断开，失败
            this.websock.onclose = this.websocketclose // 连接关闭
        }, // 初始化weosocket
        websocketonopen() {// 连接成功
            console.log("连接成功");
            this.lockReconnect = false
            this.heatBeat()
        },
        websocketonerror(err) {// 连接失败
            console.log("连接失败");
            this.lockReconnect = false
            this.reconnect()
        },
        websocketclose(err) {
            console.log("关闭连接");
            this.lockReconnect = false
            this.reconnect()
        }, // 各种问题导致的 连接关闭
        websocketonmessage(data) {
            this.heatBeat() // 收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
            if (data.data) {
                let scoketData = JSON.parse(data.data)
                if(scoketData.hasOwnProperty('type')&&scoketData.type == "heartbeat" ){ // 检测到心跳不进行重连
                    clearTimeout(this.serverTimeoutObj)
                }
                if(scoketData.hasOwnProperty('handleResult')){
                    if(!scoketData.handleResult) return
                    try {
                        this.onMessage(scoketData.handleResult)
                    }catch(err){
                        console.error('未定义onMessage方法...')
                    }
                }

            }
        }, // 数据接收

        websocketsend(data) {
            this.websock.send(JSON.stringify(data))
        }, // 数据发送

        /*外部调用方法*/
        sendMessage(data){
            this.websock.send(JSON.stringify(data))
        },

        reconnect() {
            if (this.lockReconnect) { // 这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
                return
            }
            this.lockReconnect = true
            this.reconnectData && clearTimeout(this.reconnectData)
            this.reconnectData = setTimeout(() => {
                this.initWebSocket()

            }, 3000)

        }, // socket重连
        heatBeat() {
            this.timeoutObj && clearTimeout(this.timeoutObj)
            this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
             this.timeoutObj = setTimeout(() => {
                this.websocketsend({ type: 'heartbeat' }) // 根据后台要求发送
                 this.serverTimeoutObj = setTimeout(() => {
                     this.websock.close() // 如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
                 }, 5000)
            }, this.timeout)
        }, // 心跳检测
        exit() {
            console.log("退出连接");
            this.lockReconnect = true
            this.websock.close() // 离开路由之后断开websocket连接
            clearTimeout(this.reconnectData) // 离开清除 timeout
            clearTimeout(this.timeoutObj) // 离开清除 timeout
            clearTimeout(this.serverTimeoutObj) // 离开清除 timeout
        }
    }
}
