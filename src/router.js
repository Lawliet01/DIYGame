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
      component: () => import(/* webpackChunkName: "entireGame" */ './views/entireGame.vue')
    },
    {
      path:'/gameDesign',
      component: () => import(/* webpackChunkName: "gameDesign" */ './views/gameDesign.vue'),
    },
    {
      path:'/startUpAndEndDesign',
      component:()=>import(/* webpackChunkName:"startUpAndEndDesign"*/ './views/startUpAndEndDesign.vue')
    },
    {
      path:'/previewPage',
      component:()=>import(/*webpackChunkName:"previewPage"*/ './views/previewPage.vue')
    }
  ]
})
