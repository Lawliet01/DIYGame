<template>
  <div id="gameRunner">
    <div
      style="font-size:15px;color:red;font-weight:600"
    >上、左、右键移动角色，esc键暂停</div>
    <!-- 开始界面 -->
    <div class="startUpFace" v-bind:style="startBackgroundStyle" v-if='runningGame==false'>
      <button v-bind:style="startUpBtn" v-on:click="startGame()">{{startUpBtnText}}</button>
      <div
        class="textItem"
        v-for="(item,index) in startTextComponents"
        :key="'textItem' + index"
        :style="item.style"
      >{{item.textContent}}</div>
      <div
        class="imgItem"
        v-for="(item,index) in startPictureComponents"
        :key="'pictureItem' + index"
        :style="item.style"
      >
        <img :src="item.url" :width="item.width">
      </div>
    </div>

    <!-- 结束界面 -->
    <div class="endFace" v-bind:style="endBackgroundStyle" v-if="gameEnd">
      <pre class="textFlow" v-bind:style="processTextFlow.style">{{processTextFlow.textContent}}</pre>
    </div>
  </div>
</template>

<script>
import Game from "../lib/pureGame";
import {
  levelMap,
  levelSetting,
  globalSetting,
  startUpBtn,
  startUpBtnText,
  startBackgroundStyle,
  startTextComponents,
  startPictureComponents,
  endBackgroundStyle,
  processTextFlow
} from "@/lib/previewPageData";

const pics = {};
importAll(require.context("@/pic/preViewPage", false, /(\.png|\.jpg)$/));
function importAll(r) {
  r.keys().forEach(key => (pics[key] = r(key)));
}
// console.log(pics);

export default {
  name: "previewPage",
  mounted() {
    levelSetting[0].backgroundImage = pics["./previewLevelBackground1.jpg"];
    levelSetting[1].backgroundImage = pics["./previewLevelBackground2.png"];
    globalSetting.playerSprites = pics["./previewPagePlayer.png"];
    startPictureComponents[0].url = pics["./DIYGAMElogo.png"];
  },
  data: function() {
    return {
      levelMap,
      levelSetting,
      globalSetting,
      startUpBtn,
      startUpBtnText,
      startBackgroundStyle,
      startTextComponents,
      startPictureComponents,
      runningGame:false,
      gameEnd:false,
      endBackgroundStyle,
      processTextFlow
    };
  },
  methods: {
    async startGame() {
      this.runningGame = true
      let game = new Game(document.querySelector("#gameRunner"));
      await game.runGame(levelMap, levelSetting, globalSetting);
      this.gameEnd = true;
      this.gameEndAnimation()
    },
    pixelTypeTransfer(value) {
      if (typeof value == "string") {
        return Number(value.match(/-?\d+/)[0]);
      } else {
        return value + "px";
      }
    },
    gameEndAnimation(){
       let {
        animation,
        animationTime,
        animationDistance,
        animationDir
      } = this.processTextFlow.animate;
      if (animation == false || animationTime == 0 || animationDistance == 0)
        return;
      let time = animationTime * 1000;
      let start = 0;
      if (animationDir == "top" || animationDir == "bottom") {
        let distance =
          animationDir == "top" ? -1 * animationDistance : animationDistance;
        let animate = setInterval(() => {
          this.processTextFlow.style.top =
            this.pixelTypeTransfer(this.processTextFlow.style.top) +
            (distance / time) * 60 +
            "px";
          start += 60;
          if (start > time) clearInterval(animate);
        }, 60);
      } else {
        let distance =
          animationDir == "left" ? -1 * animationDistance : animationDistance;
        let animate = setInterval(() => {
          this.processTextFlow.style.left =
            this.pixelTypeTransfer(this.processTextFlow.style.left) +
            (distance / time) * 60 +
            "px";
          start += 60;
          if (start > time) clearInterval(animate);
        }, 60);
      }
    }
  }
};
</script>

<style scoped lang='scss'>


#gameRunner {
  padding-top: 50px;
}

.startUpFace {
  margin: auto;
  position: relative;
  width: 700px;
  min-width: 700px;
  height: 400px;
  overflow: hidden;
  background-position: center;
  button {
    position: absolute;
    &:hover {
      cursor: pointer;
    }
  }
}

.endFace {
  @extend .startUpFace;
   background-image: url('../pic/preViewPage/endFaceBackground.jpg')
}


</style>