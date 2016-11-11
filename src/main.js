import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Home from './components/Home'
import ResourceInfo from './components/ResourceInfo'
import QuizBuilder from './components/QuizBuilder'
import store from './store'

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/info', component: ResourceInfo },
  { path: '/create', component: QuizBuilder }
];

export const router = new VueRouter({
  routes // short for routes: routes
});

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  store,
  render: h => h(App)
})
