/**
 * Created by admin on 2021/2/2.
 */
import {createRouter,createWebHashHistory} from "vue-router"

const routes = [
    {path:'/',component:()=>import("../view/index")},
    {path:'/login',component:()=>import("../view/login")}
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router