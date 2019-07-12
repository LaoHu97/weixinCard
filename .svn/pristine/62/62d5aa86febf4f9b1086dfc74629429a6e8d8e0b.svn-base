// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import routes from './routes'
import VueRouter from 'vue-router'
import InfiniteLoading from 'vue-infinite-loading';
import 'font-awesome/css/font-awesome.min.css'
import './api.js'
import { AjaxPlugin } from 'vux'
import { WechatPlugin } from 'vux'
import  { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
Vue.use(VueRouter)
const router = new VueRouter({
  routes
})
const FastClick = require('fastclick');
FastClick.attach(document.body);
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
