<template>
    <div class="login">
        <div>
            <input v-model="form.userName" type="text" placeholder="用户名"/><br>
            <input v-model="form.password" type="text" placeholder="密码"/><br>
            <input v-model="form.headIcon" type="text" placeholder="头像Url"/><br>
            <input type="button" @click="submit" value="注册"/>
        </div>
        <div>
            <input v-model="form.userName" type="text" placeholder="用户名"/><br>
            <input v-model="form.password" type="text" placeholder="密码"/><br>
            <input type="button" @click="login" value="登录"/>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "login",
        data() {
            return {
                form:{
                    userName:'',
                    password:'',
                    headIcon:''
                }
            }
        },
        created(){
            console.log("123");
            const url = 'http://localhost:8002/wChat/user/list'
            axios.get(url).then(data=>{
                console.log(data,"取得数据");
            }).catch(err=>{
                console.log(err);
            })
        },
        methods: {
            submit() {
                axios.post('http://localhost:8002/signin',{
                    ...this.form
                }).then(res=>{
                    localStorage.setItem("userId",res.data.userId)
                    this.$router.push("/")
                })
            },
            login(){
                axios.post('http://localhost:8002/login',{
                    ...this.form
                }).then(res=>{
                    localStorage.setItem("userId",res.data.userId)
                    this.$router.push("/")
                })
            }
        },
    }
</script>

<style lang="less" scoped>
.login{
    display: flex;
    &>div{
        margin-left: 50px;
    }
}
</style>