<template>
    <div class="login">
        <div>
            <input v-model="form.name" type="text" placeholder="用户名"/><br>
            <input v-model="form.password" type="text" placeholder="密码"/><br>
            <input v-model="form.headIcon" type="text" placeholder="头像Url"/><br>
            <input type="button" @click="submit" value="注册"/>
        </div>
        <div>
            <input v-model="form.name" type="text" placeholder="用户名"/><br>
            <input v-model="form.password" type="text" placeholder="密码"/><br>
            <input type="button" @click="login" value="登录"/>
        </div>
    </div>
</template>

<script>
    import {addUser,login} from "@api/allApi"
    import router from "../router";
    export default {
        name: "login",
        data() {
            return {
                form:{
                    name:'',
                    password:'',
                    headIcon:'',
                    phone:'15023376404'
                }
            }
        },
        created(){},
        methods: {
            submit() {
                addUser(this.form).then(res=>{
                    console.log(res);
                })
            },
            login(){
                login(this.form).then(res=>{
                    window.localStorage.setItem("info",JSON.stringify(res.data))
                    window.localStorage.setItem("token",res.token)
                    router.push({path:'/'})
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