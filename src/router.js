import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import entireGame from './views/entireGame.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path:'/playerFigure',
      component: () => import(/* webpackChunkName: "playerFigure" */ './views/playerFigure.vue'),
      children:[
        {
          path:'',
          component: () => import(/* webpackChunkName: "playerFigure" */ './components/playerFigure/PictureEdit.vue'),
        },
        {
          path:'combine',
          component: () => import(/* webpackChunkName: "playerFigure" */ './components/playerFigure/PictureCombine.vue')
        },
      ]
    },
    {
      path:'/entireGame',
      // component:entireGame
      component: () => import(/* webpackChunkName: "entireGame" */ './views/entireGame.vue')
    }
  ]
})
