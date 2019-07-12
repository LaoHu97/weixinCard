// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './api.js'
import 'font-awesome/css/font-awesome.min.css'
import { AjaxPlugin, WechatPlugin, ToastPlugin, LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
const FastClick = require('fastclick')
FastClick.attach(document.body)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
