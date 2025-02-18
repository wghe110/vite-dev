import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import 'normalize.css'
import './styles/index.scss'
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App);
app.use(router)
app.use(pinia)
app.mount('#app')
