import Record from './views/record.vue'
import Shop from './views/shop.vue'
import Details from './views/details.vue'
import Earn from './views/earn.vue'
import Err from './views/err.vue'

let routes = [
  {
    path: '/',
    name: 'shop',
    component: Shop
  },
  {
    path: '/shop',
    name: 'shop',
    component: Shop
  },
  {
    path: '/details',
    component: Details,
    name: 'Details',
  },
  {
    path: '/record',
    component: Record,
    name: 'Record',
  },
  {
    path: '/earn',
    component: Earn,
    name: 'Earn',
  },
  {
    path: '/err',
    component: Err,
    name: 'Err',
  }
];
export default routes;
