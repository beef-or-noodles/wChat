/**
 * Created by admin on 2021/2/9.
 * 接口返回数据格式
 */
function resData(option){
    let data = {
        code:200,
        data:null,
        describe:"操作成功",
        ...option
    }
    return data
}
module.exports = resData