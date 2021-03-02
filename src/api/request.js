/**
 * Created by admin on 2021/2/18.
 * axios 封装
 */
import axios from "axios"
import router from "../router/index"
var request = axios.create({
    baseURL:"http://39.99.193.63:9002", // 本地环境
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
}, error=>{
    return Promise.reject(error);
})
// 响应拦截器
request.interceptors.response.use(response=>{
    if(response.data.code == "3000"){
        let url = window.location.href.split("?")[0]
        window.location.href="http://login.ailion.cn?url="+url
    }else if(response.data.code != 200){
        return Promise.reject(response.data)
    }else{
        return Promise.resolve(response.data)
    }

})

// 上传图片
export function uploadImg(data,dirname="") {
    let param = new FormData(); // 创建form对象
    param.append("file", data); //) // 通过append向form对象添加数据
    return new Promise((resolve, redect) => {
        axios({
            method: 'post',
            url: "http://39.99.193.63:8889/api/upload",
            data: param,
            headers: {
                "Content-Type": "multipart/form-data",
                "dirname":dirname
            },
        }).then(response => {
            if (response.data.code == 200) {
                resolve(response.data.data);
            } else {
                reject("上传失败")
            }
        }, err => {
            reject(err)
        });
    })

}

export default request;