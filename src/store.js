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
    x:0,
    y:0,
    src:null,
  },
  mutations: {
    uploadImgData(state, valuePair){
      Object.keys(valuePair).forEach(key => {
        state[key] = valuePair[key]
      })
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

let startUpFace = {
  namespaced:true,
  state:{
    startUpBtn: {
      left: "300px",
      top: "150px",
      width: "100px",
      height: "80px",
      borderRadius: "10px",
      color: "#000000",
      backgroundColor: "#ffffff",
      borderWidth: "1px",
      borderColor: "#0000ff",
      fontSize: "20px",
      zIndex: 0
    },
    pictureComponents:[],
    textComponents:[],
    backgroundStyle: {
      backgroundImage: "",
      backgroundColor: "#000000",
      backgroundSize: "700px 400px",
      backgroundRepeat: "no-repeat"
    },
    startUpBtnText: "开始游戏",
  },
  getters:{
    getComponentPropertyByIndex:(state)=>(type,index)=>{
      if (type === 'text'){
        return state.textComponents[index]
      }else if (type === 'picture'){
        return state.pictureComponents[index]
      }else{
        throw new Error('no such type')
      }
    },
    //可直接使用的style
    processTextComponent:(state)=>{
      return state.textComponents.map(component=>{
        return {
          style:{
            top: component.top + "px",
            left: component.left + "px",
            fontSize: component.fontSize + "px",
            color: component.color,
            opacity: component.opacity,
            transform: `rotate(${component.rotate}deg)`,
            zIndex: component.zIndex,
            position: "absolute"
          },
          textContent:component.textContent
        }
      })
    },
    //可直接使用的style
    processPictureComponent:(state)=>{
      return state.pictureComponents.map(component=>{
        return {
          style:{
            top: component.top + "px",
            left: component.left + "px",
            opacity: component.opacity,
            transform: `rotate(${component.rotate}deg)`,
            zIndex: component.zIndex,
            filter: component.filter,
            position: "absolute"
          },
          url:component.url,
          width:component.width
        }
      })
    }
  },
  mutations:{
    addPictureComponents(state,style){
      style.index = state.pictureComponents.length;
      state.pictureComponents.push(style)
    },
    addTextComponents(state,style){
      style.index = state.textComponents.length;
      state.textComponents.push(style)
    },
    restart(state){
      state.pictureComponents = [];
      state.textComponents = [];
    },
    changeData(state,style){
      for (let key in style){
        if (state[key] == undefined) throw new Error('no such keys')
        state[key] = style[key]
      }
    }
  }
}

export default new Vuex.Store({
  modules:{
    playerFigure,
    gameLevel,
    startUpFace,
  }
})
