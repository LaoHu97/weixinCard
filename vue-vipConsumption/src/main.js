
import Vue from 'vue'
import App from './App'
import router from './router'
import './api.js'
import { AjaxPlugin } from 'vux'
import { WechatPlugin } from 'vux'
import  { ToastPlugin } from 'vux'
import  { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
const FastClick = require('fastclick');
FastClick.attach(document.body);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
