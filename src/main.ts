import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

// createApp(App).mount('#app')

const app = createApp(App)

// use() = 플로그인을 앱에 등록하는 메소드
/*

rouert의 네이베이션 가드에서 pinia store를 사용하기 때문에
pinia를 router보다 먼저 등록해야함
*/ 

app.use(createPinia())
app.use(router)
app.mount('#app')

