import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import 'animate.css'
import '../node_modules/spinkit/css/spinkit.css'

import App from './App'

import vuexStore from './store'
import router from './router';



Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store(vuexStore);

new Vue({
  el: '#app',
  // provide the store using the "store" option.
  // this will inject the store instance to all child components.
  store,
  router,
  render: h => h(App)
})

Vue.filter('json', function(value, spaces) {
  return JSON.stringify(value, null, spaces || 2);
})