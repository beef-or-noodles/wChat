/**
 * Created by Administrator on 2021/2/3.
 */
const userList = [{
    userId:1,
    userName:'吴万强',
    headIcon:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3250602694,1048058176&fm=26&gp=0.jpg',
},{
    userId:2,
    userName:'小小只',
    headIcon:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3755467654,3504056667&fm=26&gp=0.jpg',
},{
    userId:3,
    userName:'三只小猪',
    headIcon:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2149744163,680333355&fm=26&gp=0.jpg',
}]
/*
* sendTime：发送时间
* type 1 文字 2 图片
* headIcon：发送人头像
* text：消息内容
* userId：发送人id
* targetId：接收人id
* */
const messageList = [{
    sendTime:'20-20-05 03:20',
    type:2,
    headIcon:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3250602694,1048058176&fm=26&gp=0.jpg',
    text:'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg',
    userId:1,
    targetId:2
},{
    sendTime:'20-20-05 03:20',
    type:1,
    headIcon:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3755467654,3504056667&fm=26&gp=0.jpg',
    text:'饿了么的外卖？',
    userId:2,
    targetId:1
},{
    sendTime:'20-20-05 03:20',
    type:1,
    headIcon:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2149744163,680333355&fm=26&gp=0.jpg',
    text:'发给三的数据？',
    userId:3,
    targetId:1
}]
module.exports = {
    userList,messageList
}