import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: resolve => require(['../views/index.vue'], resolve)
    },
    {
      path: '/table01',
      name: 'table01',
      component: resolve => require(['../views/table01.vue'], resolve)
    },
    {
      path: '/table02',
      name: 'table02',
      component: resolve => require(['../views/table02.vue'], resolve)
    },
    {
      path: '/table03',
      name: 'table03',
      component: resolve => require(['../views/table03.vue'], resolve)
    },
    {
      path: '/table04',
      name: 'table04',
      component: resolve => require(['../views/table04.vue'], resolve)
    },
    {
      path: '/table05',
      name: 'table04',
      component: resolve => require(['../views/table05.vue'], resolve)
    },
    {
      path: '/table06',
      name: 'table06',
      component: resolve => require(['../views/table06.vue'], resolve)
    }
  ]
})
