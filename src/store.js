import Vue from 'vue'
import Vuex from 'vuex'
import defaultGameMap from './lib/gameLevel'

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
    clearAll(state){
      Object.keys(state).forEach(key=>{
        state[key] = null
      })
    }
  },
};

let gameLevel = {
  namespaced:true,
  state:{
    levelMap:[],
    levelSetting:[],
    currentLevel:0,
    structureDesign:false,
    globalPlayerSetting:{
      lives:3,
      size:1,
      speed:7,
      jumpSpeed:17,
      playerSprites:null
    }
  },
  mutations:{
    addLevel(state){
      state.levelMap.push(defaultGameMap[0]);
      state.levelSetting.push({ 
        backgroundColor:'#34a6fb',
        backgroundImage:null
      })
      state.currentLevel = state.levelMap.length -1
    },
    changeGameMap(state,newMap){
      //看看是否需要注意响应式属性的问题
      if (typeof newMap != 'string') throw new Error('the map not a string' + newMap )
      Vue.set(state.levelMap,state.currentLevel,newMap)
    },
    changeLevel(state,newLevel){
      state.currentLevel = newLevel
    },
    toggleStructureDesign(state){
      state.structureDesign = !state.structureDesign
    },
    changeBackgroundColor(state,color){
      state.levelSetting[state.currentLevel].backgroundColor = color
    },
    changeBackgroundImage(state,image){
      state.levelSetting[state.currentLevel].backgroundImage = image
    },
    changeGlobalPlayerSetting(state,valuePair){
      Object.keys(valuePair).forEach(key=>{
        state.globalPlayerSetting[key] = valuePair[key]
      })
    }
  }

}

export default new Vuex.Store({
  modules:{
    playerFigure,
    gameLevel
  }
})
