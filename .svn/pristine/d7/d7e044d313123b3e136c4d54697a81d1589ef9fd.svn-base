import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import list from '@/components/list'
import commer from '@/components/commer'
import err404 from '@/components/404'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list',
      component: list
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/commer',
      name: 'commer',
      component: commer
    },
    {
      path: '*',
      name: 'err404',
      component: err404
    }
  ]
})
