import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.css'


import {
  Tab,
  Tabs,
  List,
  Cell,
  CellGroup,
  Button,
  Tag,
  Image,
  Stepper,
  Dialog
} from "vant";


Vue.use(Tab).use(Tabs);
Vue.use(List);
Vue.use(Cell).use(CellGroup);
Vue.use(Button);
Vue.use(Tag);
Vue.use(Image);
Vue.use(Stepper);
Vue.use(Dialog);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
