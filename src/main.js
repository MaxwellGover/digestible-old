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
  { path: '/info', name: 'info', component: ResourceInfo },
  { path: '/create', component: QuizBuilder },
  { path: '/profile/:uid', component: Profile },
  { path: '/quiz/:id', component: Quiz }
];

export const router = new VueRouter({
  routes // short for routes: routes
});

new Vue({
  router,
  el: '#app',
  // provide the store using the "store" option.
  // this will inject the store instance to all child components.
  store,
  render: h => h(App)
})
