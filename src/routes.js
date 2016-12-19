import Home from './pages/Home'
import ResourceInfo from './pages/ResourceInfo'
import QuizBuilder from './pages/QuizBuilder'
import Profile from './pages/Profile'
import Quiz from './pages/Quiz'
import NotFoundComponent from './pages/NotFound'

export default [
  { path: '/', component: Home },
  { path: '/info/:resourceId', name: 'info', component: ResourceInfo },
  { path: '/info/create', name: 'createInfo', component: ResourceInfo },
  { path: '/create', component: QuizBuilder },
  { path: '/profile/:uid', component: Profile },
  { path: '/quiz/:resourceId', name: 'quiz', component: Quiz },
  { path: '*', component: NotFoundComponent }
];