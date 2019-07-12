import Vue from 'vue'
import Router from 'vue-router'
import index from '../views/index'
import commer from '../views/commer'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },{
      path: '/commer',
      name: 'commer',
      component: commer
    },
  ]
})
