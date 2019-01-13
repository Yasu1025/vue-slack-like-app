import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login.vue'
import Chat from '@/pages/Chat.vue'
// Firebase
import auth from 'firebase/auth'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Chat,
      beforeEnter: (to, from, next) => {
        if(!firebase.auth().currentUser) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      component: Login
    }
  ],
  mode: 'history'
})
