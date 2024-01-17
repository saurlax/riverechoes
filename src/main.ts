import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'

import App from './App.vue'
import Index from './pages/Index.vue'
import Map from './pages/Map.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Index
    }, {
      path: '/map',
      component: Map
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
