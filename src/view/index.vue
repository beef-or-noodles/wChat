<template>
    <div class="content">
        <div class="chatBox">
            <div class="tool">
                <div class="headImg">
                    <img :src="myInfo.headIcon" alt="">
                </div>
                <div class="mesIcon active">
                    <i class="iconfont iconxiaoxi1"></i>
                </div>
                <div class="menuIcon mesIcon">
                    <i class="iconfont iconcaidan"></i>
                </div>
            </div>
            <div class="user">
                <div class="topBox">
                    <div class="search">
                        <i class="iconfont iconsousuo"></i>
                        <input class="input" type="text" placeholder="搜索">
                        <div class="add">
                            <i class="iconfont iconplus"></i>
                        </div>
                    </div>
                </div>
                <div class="userList">
                    <div class="item"
                         v-for="item in userList"
                         @click="selectUser(item)"
                         :class="[item.id==userItem.id?'active':'']">
                        <div class="dot" v-if="item.read"></div>
                        <div class="icon">
                            <img :src="item.headIcon" alt="">
                        </div>
                        <div class="mesBox">
                            <div class="nameBox">
                                <span class="name">{{item.name}}</span>
                                <span class="time">{{item.time}}</span>
                            </div>
                            <div class="abs">{{item.text}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="message">
                <template v-if="userItem.id">
                    <div class="topBox">
                        <div class="title">
                            {{userItem.name}}
                        </div>
                    </div>
                    <div class="mesList" ref="mesBox">
                        <template v-for="item in messageList">
<!--                            <div class="time">-->
<!--                                <span>{{item.sendTime}}</span>-->
<!--                            </div>-->
                            <div class="item" :class="[userId==item.userId?'right':'left']">
                                <div class="mesicon">
                                    <img :src="item.headIcon" alt="">
                                </div>
                                <div class="text" v-if="item.type == 1">
                                    {{item.text}}
                                </div>
                                <div class="fileBox" v-else-if="item.type==2">
                                    <div class="img">
                                        <img :src="item.text" alt="">
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="loading" v-if="lockReconnect">连接中。。。</div>
                    </div>
                    <div class="sendBox" :style="{height:sendHeight+'px'}">
                        <div class="mestool" :style="{background: !focusArea?'#f5f5f5':'white'}">
                            <div class="item">
                                <i class="iconfont iconbiaoqing"></i>
                            </div>
                        </div>
                        <div @keyup.enter.native="send" ref="textarea" @focus="areaFocus(true)" @blur="areaFocus(false)"
                             contenteditable="true" class="textarea"></div>
                        <div class="sendBtn" :style="{background: !focusArea?'#f5f5f5':'white'}">
                            <button class="btn" @click="send">发送(S)</button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="bg"></div>
    </div>
</template>

<script>
    import scoket_mixin from '../mixins/scoket_mixin'
    import {userList,messageList} from "@api/allApi"
    export default {
        mixins: [scoket_mixin],
        data() {
            return {
                sendHeight: 160,
                marginBottom: 150, // 滚动条距离底部
                focusArea: false,
                userId:JSON.parse(localStorage.getItem("info")).id,
                messageList: [],
                myInfo:JSON.parse(localStorage.getItem("info")),
                userList:[],
                userItem:{},
                pagging:{
                    pageNo:1,
                    pageSize:10,
                    marginBottom:0,
                    total:0
                }
            }
        },
        created() {
            if(this.userId){
                this.getUserList()
            }else {
                this.$router.replace('/login')
            }
        },
        methods: {
            areaFocus(type) {
                this.focusArea = type
            },
            selectUser(item){
                item['read'] = false
                this.userItem = item
                this.pagging = {
                    pageNo:1,
                    pageSize:10,
                    marginBottom:0,
                    total:0
                }
                this.getMessageList(2)
                setTimeout(()=>{
                    this.listenerFunction()
                    let dom = this.$refs.textarea
                    dom.focus()
                },10)
            },

            listenerFunction(e) {
                this.$refs.mesBox.addEventListener('scroll', this.handleScroll, true);
            },
            handleScroll(e){
                let target = e.target
                let scrollTop = target.scrollTop
                let off = (this.pagging.pageNo-1) * this.pagging.pageSize
                console.log(off);
                if(scrollTop == 0 && off<this.pagging.total){
                    this.pagging.marginBottom = target.scrollHeight - target.scrollTop - target.clientHeight
                    this.pagging.pageNo = this.pagging.pageNo+=1
                    this.getMessageList()
                }
            },

            // 获取消息列表
            getMessageList(type=1){
                let params = {
                    userId:this.userId,
                    targetId:this.userItem.id,
                    ...this.pagging
                }
                messageList(params).then(res=>{
                    if(type==2){
                        this.messageList = res.data.list
                        this.goBottom(true)
                    }else if(type==1){
                        this.messageList.unshift(...res.data.list)
                        this.goBottom(true)
                    }
                    this.pagging.total = res.data.total
                })
            },
            getUserList(){
                userList().then(res=>{
                    this.userList = res.data.list
                })
            },
            // 到底部
            goBottom(type=false){
                let mesBox = this.$refs.mesBox
                setTimeout(() => {
                    let marginBottom = mesBox.scrollHeight - mesBox.scrollTop - mesBox.clientHeight
                    if (type || marginBottom < this.marginBottom) {
                        mesBox.scrollTop = mesBox.clientHeight - this.pagging.marginBottom;
                    }
                }, 0)
            },
            onMessage(data) {
                let _this = this
                if (data.userId == this.userItem.id){ // 当前打开的对话
                    addUserText(1)
                    this.messageList.push(data)
                    this.goBottom(false)
                }else{ // 未打开对话 添加到消息列表
                    addUserText(2)
                }
                function addUserText(type){
                    _this.userList.forEach(ls=>{
                        if(ls['id'] == data.userId){
                            ls['time'] = data.time
                            ls['text'] = data.text
                            ls['read'] = type==2?true:false
                        }
                    })
                }

            },
            send() {
                let dom = this.$refs.textarea
                let mesBox = this.$refs.mesBox
                let text = dom.innerText
                let sendTime = new Date().format('yyyy-MM-dd hh:mm')
                // type 1 文字普通消息  2 图片消息
                let params = {
                    targetId: this.userItem.id,
                    userId: this.myInfo.id,
                    text,
                    headIcon:this.myInfo.headIcon,
                    sendTime,
                    type: 1
                }
                this.sendMessage(params)
                this.messageList.push(params)
                dom.innerText = ""
                dom.focus()
                setTimeout(()=>{
                    mesBox.scrollTop = mesBox.scrollHeight;
                },10)

            }
        },
    }
</script>
<style lang="less" scoped>

    ::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
    }

    ::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        background: rgba(0, 0, 0, .1);
    }

    .content {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .bg {
            position: fixed;
            width: 100%;
            height: 100%;
            background: url("../assets/bg.jpg");
            background-size: cover;
            background-position: center;
            filter: blur(6px);
            z-index: 10;
        }

        .chatBox {
            box-shadow: 0px 0px 3px #c5c5c5;
            z-index: 20;
            width: 950px;
            height: 600px;
            display: flex;

            .topBox {
                height: 70px;
                display: flex;
                align-items: center;
                padding: 15px;
            }

            .search {
                display: flex;

                .iconsousuo {
                    width: 20px;
                    display: flex;
                    align-items: center;
                    background-color: #dbd9d8;
                    padding-left: 10px;
                    border-bottom-left-radius: 5px;
                    border-top-left-radius: 5px;
                }

                .input {
                    background-color: #dbd9d8;
                    border: none;
                    border-bottom-right-radius: 5px;
                    border-top-right-radius: 5px;
                    padding-left: 5px;
                    width: 145px;

                    &:focus {
                        outline: none;
                        background-color: white;
                    }
                }

                .add {
                    background-color: #dbd9d8;
                    border-radius: 5px;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: #636363;
                    margin-left: 10px;
                }
            }

            .tool {
                width: 65px;
                height: 100%;
                background: #27292d;
                padding: 10px 0;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;

                & > div {
                    margin-bottom: 25px;

                    &.active {
                        color: #07c160;
                    }
                }

                .headImg {
                    width: 40px;
                    height: 40px;
                    border-radius: 4px;
                    overflow: hidden;

                    img {
                        width: 100%;
                    }
                }

                .mesIcon {
                    color: #9f9f9f;

                    .iconfont {
                        font-size: 25px;
                    }
                }

                .menuIcon {
                    position: absolute;
                    bottom: 20px;
                    margin-bottom: 0;
                }
            }

            .user {
                background: #eceae8;
                position: relative;
                display: flex;
                flex-direction: column;

                .userList {
                    flex: 1;
                    overflow: auto;

                    .item {
                        padding: 10px;
                        display: flex;
                        position: relative;
                        .dot{
                            width: 10px;
                            height: 10px;
                            border-radius: 50%;
                            background: red;
                            position: absolute;
                            left: 50px;
                            top: 5px;
                        }
                        &.active {
                            background-color: #c6c6c6;
                        }

                        &:hover {
                            cursor: pointer;
                            background-color: #d9d9d9;
                        }

                        .icon {
                            width: 45px;
                            height: 45px;
                            border-radius: 4px;
                            overflow: hidden;
                            margin-right: 15px;

                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .mesBox {
                            overflow: hidden;
                            flex: 1;

                            .nameBox {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;

                                .name {
                                    display: block;
                                    flex: 1;
                                    width: 0px;
                                    font-size: 14px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    padding-right: 5px;
                                }

                                .time {
                                    display: block;
                                    width: 85px;
                                    text-align: right;
                                    font-size: 12px;
                                }
                            }

                            .abs {
                                width: 150px;
                                font-size: 13px;
                                color: #999999;
                                padding-top: 5px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                    }

                }
            }

            .message {
                flex: 1;
                background: #f5f5f5;
                display: flex;
                flex-direction: column;

                .title {
                    font-size: 20px;
                    font-weight: 500;
                }

                .topBox {
                    border-bottom: 1px solid #e7e7e7;
                }

                .mesList {
                    flex: 1;
                    overflow: auto;
                    padding: 0 25px;

                    .loading {
                        font-size: 12px;
                        text-align: center;
                        padding-left: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 10px 0;

                        &::before {
                            content: "";
                            display: block;
                            width: 12px;
                            height: 12px;
                            border: 2px solid #9f9f9f;
                            border-radius: 50%;
                            margin-right: 8px;
                            border-left-color: #c10003;
                            animation: turn 1s linear infinite;
                        }

                        @keyframes turn {
                            0% {
                                -webkit-transform: rotate(0deg);
                            }
                            25% {
                                -webkit-transform: rotate(90deg);
                            }
                            50% {
                                -webkit-transform: rotate(180deg);
                            }
                            75% {
                                -webkit-transform: rotate(270deg);
                            }
                            100% {
                                -webkit-transform: rotate(360deg);
                            }
                        }
                    }

                    .time {
                        text-align: center;
                        font-size: 12px;

                        span {
                            color: white;
                            display: inline-block;
                            background-color: #d1d1d1;
                            padding: 2px 5px;
                            border-radius: 2px;
                        }
                    }

                    .item {
                        display: flex;
                        margin: 10px 0;

                        .fileBox {
                            margin-left: 10px;

                            .img {
                                img {
                                    max-width: 350px;
                                }
                            }
                        }

                        .mesicon {
                            width: 40px;
                            height: 40px;

                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .text {
                            padding: 10px;
                            max-width: 390px;
                            box-shadow: 1px 1px 5px #eeeeee;
                            border-radius: 5px;
                            position: relative;
                            word-wrap: break-word;

                            &:after {
                                content: "";
                                position: absolute;
                                width: 0px; /*设置宽高为0，所以div的内容为空，从才能形成三角形尖角*/
                                height: 0px;

                                border-left: 10px solid transparent; /*transparent 表示透明*/
                                border-right: 10px solid transparent;

                            }
                        }

                        &.left {
                            @color: white;

                            .fileBox {
                                margin-left: 10px;
                            }

                            .text {
                                margin-left: 10px;
                                background-color: @color;

                                &:after {
                                    top: 15px;
                                    left: -13px;
                                    transform: rotate(-90deg);
                                    border-bottom: 10px solid @color;
                                }
                            }
                        }

                        &.right {
                            @color: #59dba6;
                            flex-flow: row-reverse;

                            .fileBox {
                                margin-right: 10px;
                            }

                            .text {
                                margin-right: 10px;
                                background-color: @color;

                                &:after {
                                    top: 15px;
                                    right: -13px;
                                    transform: rotate(90deg);
                                    border-bottom: 10px solid @color;
                                }
                            }
                        }
                    }
                }

                .sendBox {
                    display: flex;
                    flex-direction: column;
                    border-top: 1px solid #e7e7e7;
                    position: relative;

                    .mestool {
                        background-color: #f5f5f5;
                        width: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 50px;
                        display: flex;
                        align-items: center;
                        padding: 0 15px;

                        .item {
                            width: 35px;
                            height: 35px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #818181;

                            i {
                                font-size: 20px;
                            }

                            &:hover {
                                cursor: pointer;
                                color: #2e2e2e;
                            }
                        }
                    }

                    .textarea {
                        flex: 1;
                        padding: 0 25px;
                        padding-top: 50px;
                        overflow: auto;
                        word-wrap: break-word;
                        max-width: 634px;

                        &:focus {
                            outline: none;
                            background-color: white;
                        }
                    }

                    .sendBtn {
                        text-align: right;
                        padding-right: 25px;
                        padding-bottom: 10px;

                        .btn {
                            border: 1px solid #b6b6b6;
                            padding: 5px 15px;

                            &:hover {
                                background: #07c160;
                                color: white;
                                cursor: pointer;
                            }

                            &:focus {
                                outline: none
                            }
                        }
                    }
                }
            }
        }
    }
</style>