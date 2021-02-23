/**
 * Created by admin on 2021/2/18.
 * axios 封装
 */
import axios from "axios"
import router from "../router/index"
const request = axios.create({
    baseURL:"http://localhost:8002", // 本地环境
    method:'post',
    timeout:5000, // 请求超时时间
    responseType:'json'
})
// 请求拦截器
request.interceptors.request.use(config=>{
    let token = localStorage.getItem("token")
    try{
        config.headers["token"] = token
    }catch (e) {
        console.log(e);
    }
    return config
})
// 响应拦截器
request.interceptors.response.use(response=>{
    if(response.data.code == "3000"){
        router.replace('/login')
    }else if(response.data.code != 200){
        return Promise.reject(response.data)
    }else{
        return Promise.resolve(response.data)
    }

})
export default request;