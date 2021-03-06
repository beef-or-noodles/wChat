/**
 * Created by admin on 2021/2/18.
 * 请求文件
 */
import request from "../request"
export function addUser(params){
    return request.post("/wChat/user/add",{...params})
}
export function login(params){
    return request.post("/wChat/user/login",{...params})
}
export function userInfo(token) {
    return request.post("http://39.99.193.63:8889/api/userInfo",{token})
}
export function userList(){
    return request.get("/wChat/user/list")
}


/* 消息 */
export function messageList(params){
    return request.get('/wChat/message/list',{params:params})
}