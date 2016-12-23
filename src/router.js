import VueRouter from 'vue-router'

import Home from './pages/Home'
import ResourceInfo from './pages/ResourceInfo'
import QuizBuilder from './pages/QuizBuilder'
import Profile from './pages/Profile'
import Quiz from './pages/Quiz'
import NotFoundComponent from './pages/NotFound'

export const routes = [
  { path: '/', component: Home },
  { path: '/info/:resourceId', component: ResourceInfo },
  { path: '/info', component: ResourceInfo },
  { path: '/create', component: QuizBuilder },
  { path: '/profile/:uid', component: Profile },
  { path: '/quiz/:resourceId', component: Quiz },
  { path: '*', component: NotFoundComponent }
];

export const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history'
});

export default router;