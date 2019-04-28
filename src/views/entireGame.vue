<template>
  <div>
    entireGame
    <div class="gameContainer"></div>
    <button @click='goToPlayerFigureDesign()'>playerFigureDesign</button>
    <button @click='goToGameDesign()'>GameDesign</button>
    <button @click='downloadTheGame()'>downloadTheGame</button>
  </div>
</template>

<script>
import Game from "../lib/pureGame";
import gameLevel from "../lib/gameLevel";
import { mapState } from "vuex";


export default {
  name: "entrieGame",
  beforeRouteLeave(to,from,next){
     this.runningGame.stopGame()
    next()
  },
  mounted:function(){
    let levelMap = this.$store.state.gameLevel.levelMap;
    levelMap = levelMap.length==0?gameLevel:levelMap
    this.runningGame = new Game(this.gameContainer)
    this.runningGame.runGame(levelMap,this.levelSetting,this.globalPlayerSetting)
     //如果数据存在，就直接变化player的形状。
    // if (this.playerFigure != null) this.game.mutate({playerSprites:this.playerFigure})

  },
  data:function(){
    return{
      runningGame:null
    }
  },
  computed:{
    ...mapState("gameLevel", [
      "levelMap",
      "levelSetting",
      "currentLevel",
      "structureDesign",
      "globalPlayerSetting"
    ]),
    gameContainer(){
      return document.querySelector('.gameContainer')
    },
    playerFigure(){
      let src = this.$store.state.playerFigure.result;
      if (src == null) return null;
      let image = new Image();
      image.src = this.$store.state.playerFigure.result;
      return image
    }
  },
  methods: {
    goToPlayerFigureDesign(){
      this.$router.push('/playerFigure/combine')
    },
    goToGameDesign(){
      this.$router.push('/gameDesign')
    },
    downloadTheGame(){

    }
  }
};
</script>

