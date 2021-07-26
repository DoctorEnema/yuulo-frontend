import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../pages/home'
import board from '../pages/board'
import cardDetails from '../pages/card-details'
import dashboard from '../cmps/board/dashboard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
  },
  {
    path: '/board/:boardId/',
    name: 'board',
    component: board,
    children: [
      {
        path: 'dashboard',
        component: dashboard
      },
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: ':groupId/:cardId/:isEditCard',
        component: cardDetails
      },
    ]
  },
  // {
  //   path: '/card/:cardId',
  //   name: 'card',
  //   component: cardDetails
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
