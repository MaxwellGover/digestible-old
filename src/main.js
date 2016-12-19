import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import App from './App'

import vuexStore from './store'

import routes from './routes';

Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store(vuexStore);

const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history'
});

new Vue({
  el: '#app',
  // provide the store using the "store" option.
  // this will inject the store instance to all child components.
  store,
  router,
  render: h => h(App)
})
