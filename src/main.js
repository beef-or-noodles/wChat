import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import less from 'less'
import './assets/iconfont/iconfont.css'
const app = createApp(App)
app.use(router)
app.use(less)

app.mount('#app')
