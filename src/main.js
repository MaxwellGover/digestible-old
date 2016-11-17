import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Home from './pages/Home'
import ResourceInfo from './pages/ResourceInfo'
import QuizBuilder from './pages/QuizBuilder'
import Profile from './pages/Profile'
import Quiz from './pages/Quiz'
import store from './store'

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/info', component: ResourceInfo },
  { path: '/create', component: QuizBuilder },
  { path: '/profile', component: Profile },
  { path: '/quiz', component: Quiz }
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
