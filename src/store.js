import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let playerFigure = {
  namespaced:true,
  state: {
    //存储的是能拿来渲染的image的数据
    imgData: null,
    width:null,
    height:null,
    x:null,
    y:null,
    src:null,
    result:null
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
    },
    uploadPlayerFigureResult(state,result){
      state.result = result
    },
    clearAll(state){
      Object.keys(state).forEach(key=>{
        state[key] = null
      })
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
