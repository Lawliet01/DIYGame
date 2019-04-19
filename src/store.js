import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let playerFigure = {
  namespaced:true,
  state: {
    imgData: null,
    width:null,
    height:null
  },
  mutations: {
    uploadImgData(state,data){
      state.imgData = data
      state.width = data.width;
      state.height = data.height
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
