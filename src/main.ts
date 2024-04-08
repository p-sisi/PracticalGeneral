import { createApp } from 'vue'
import router from './router'
import { store } from '@/store';
import './style.css'
import App from './App.vue';
import 'element-plus/es/components/message/style/css';


const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app')
