import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import commer from '@/components/commer'
import list from '@/components/list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/commer',
      name: 'commer',
      component: commer
    },
    {
      path: '/',
      name: 'list',
      component: list
    },
  ]
})
