// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { config } from './firebase'
import store from './store/index'
// Firebase
import firebase from 'firebase/app'
import auth from 'firebase/auth'

Vue.config.productionTip = false


// Initialize Firebase
config

// get user after reload
const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  store.dispatch('setUser', user)

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  })

  // this calls itself on state change
  unsubscribe()

})

