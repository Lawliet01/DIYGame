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


export default {
  name: "entrieGame",
  beforeRouteLeave(to,from,next){
    this.game.stopGame()
    next()
  },
  mounted:function(){
     this.game.runGame(gameLevel)
     //如果数据存在，就直接变化player的形状。
     if (this.playerFigure != null) this.game.mutate({playerSprites:this.playerFigure})
  },
  computed:{
    game(){
      //注意删除游戏
      return new Game(this.gameContainer)
    },
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

    },
    downloadTheGame(){

    }
  }
};
</script>

