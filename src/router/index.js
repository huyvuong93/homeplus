import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignUp from '@/components/Signup.vue'
import SignIn from '@/components/Signin.vue'
import ToDoList from '@/components/ToDoList.vue'
import Profile from '@/components/Profile.vue'
import Reward from '@/components/Reward.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path:'/index.html',
    component: Home,
    alias:''
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signin',
    name: 'Signin',
    component: SignIn,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignUp,
 
  },
  {
    path: '/todolist',
    name: 'Todolist',
    component: ToDoList,

  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,

  },
  {
    path: '/reward',
    name: 'Reward',
    component: Reward,

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
