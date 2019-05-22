import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router =  new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/playerFigure',
      component: () => import(/* webpackChunkName: "playerFigure" */ './views/playerFigure.vue'),

      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "playerFigure" */ './components/playerFigure/PictureEdit.vue'),
        },
        {
          path: 'combine',
          component: () => import(/* webpackChunkName: "playerFigure" */ './components/playerFigure/PictureCombine.vue')
        },
      ]
    },
    {
      path: '/entireGame',
      component: () => import(/* webpackChunkName: "entireGame" */ './views/entireGame.vue'),
    },
    {
      path: '/gameDesign',
      component: () => import(/* webpackChunkName: "gameDesign" */ './views/gameDesign.vue'),
    },
    {
      path: '/startUpAndEndDesign',
      component: () => import(/* webpackChunkName:"startUpAndEndDesign"*/ './views/startUpAndEndDesign.vue')
    },
    {
      path: '/previewPage',
      component: () => import(/*webpackChunkName:"previewPage"*/ './views/previewPage.vue')
    },
    {
      path: '/help',
      component: () => import(/*webpackChunkName:"help"*/ './views/help.vue')
    }
  ]
})

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
    // Start the route progress bar.
    NProgress.start()
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})


export default router;