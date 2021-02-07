/**
 * Created by admin on 2021/2/7.
 * mysql数据库连接
 */
var mysql = require("mysql")
// 创建数据库连接池

var pool = mysql.createPool({
    host:"localhost",
    prot:"3306",
    database:"wChat",
    user:"root",
    password:"123456"
})
// 从连接池里面获取一个连接
function query(sql,params=[]){
    return new Promise((resolve, reject)=>{
        pool.getConnection((err,conn)=>{
            if(err){
                reject(err)
            }else{
                conn.query("select * from user",(err2,res)=>{
                    if(err2){
                        reject(err2)
                    }else{
                        resolve(res)
                        conn.release()
                       // pool.end()
                    }
                })
            }
        })
    })
}
module.exports={
    query
}