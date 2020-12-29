import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/icon/iconfont.css'
import axios from 'axios'

axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';           //配置请求头
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = 'jwt '+window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
