import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let playerFigure = {
  namespaced:true,
  state: {
    imgData: null,
    width:null,
    height:null,
    x:null,
    y:null,
    src:null
  },
  mutations: {
    uploadImgData(state,playload){
      state.imgData = playload.imgData
      state.width = playload.width;
      state.height = playload.height;
      state.x = playload.x;
      state.y = playload.y
    },
    uploadImgSrc(state,src){
      state.src = src
    }
  },
  actions: {

  }
}

export default new Vuex.Store({
  modules:{
    playerFigure
  }
})
