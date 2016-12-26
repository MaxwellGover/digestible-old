import VueRouter from 'vue-router'

import Home from './pages/Home'
import ResourceInfo from './pages/ResourceInfo'
import QuizBuilder from './pages/QuizBuilder'
import Profile from './pages/Profile'
import Quiz from './pages/Quiz'
import NotFoundComponent from './pages/NotFound'
import Beginner from './pages/Beginner'
import {firebase} from './db'
import store from './store'

export const routes = [
  { path: '/', component: Home },
  { path: '/info', component: ResourceInfo,
    // a meta field
    meta: { requiresAuth: true }
  },
  { path: '/info/:resourceId', component: ResourceInfo,
    // a meta field
    meta: { requiresAuth: true }
  },
  { path: '/create', component: QuizBuilder,
    // a meta field
    meta: { requiresAuth: true }
  },
  { path: '/profile/:uid', component: Profile },
  { path: '/getting-started', component: Beginner },
  { path: '/quiz/:resourceId', component: Quiz },
  { path: '*', component: NotFoundComponent }
];

let router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  // console.log('beforeEach', to, from, next)
  // console.log('user', store.state.userInfo)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    // console.log('check user', store.state.userInfo)
    //if (!store.state.userInfo) { // can not get userInfo here
      // next({
      //   path: '/login',
      //   query: { redirect: to.fullPath }
      // })
    store.dispatch('checkAuth') // login if not authenticated

    next() // stay on restricted page --> check what happens if login fails
    // } else {
    //   next()
    // }
  } 
  else {
    next() // make sure to always call next()!
  }
})

export default router;