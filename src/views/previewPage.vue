<template>
  <div id="gameRunner">
    <!-- 开始界面 -->

    <div class="startUpFace" v-bind:style="startBackgroundStyle" v-if="runningGame==false">
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

    <!-- 提示 -->
    <div
      v-if="runningGame==false&&gameEnd==false"
      style="font-size:15px;color:red;font-weight:600"
    >{{is_touch_device()?`${lang === 1 ? "操作屏幕按键移动角色,横屏再开始游戏体验更加":""}`:`${lang===1?'(上、左、右键移动角色，esc键暂停)':'Press [left,right,up] key to move player. Press [esc] key to pause the game.'}`}}</div>
    <div
      v-if="runningGame==false&&gameEnd==false"
      style="font-weight:600; width: 70vw; margin: auto;"
    >{{lang===1?"这是一个游戏的实例，您可以在「设计总台」中设计属于你自己的游戏"
          :"This is an example of the game that you can make on the console."}}</div>
      <!-- <div
      v-if="runningGame&&!gameEnd"
      style="font-weight:600; width: 70vw; margin: auto;"
    >{{lang === 1 ?"这是游戏的运行界面，您可以自定义这里的关卡结构、元素、背景等等"
      : "On your own game, you can set up any number of Levels and add elements(coin, lava, monster and so on ) to each level base on your idea."}}</div>
    <div
      v-if="gameEnd"
      style="font-weight:600"
    >{{lang === 1 ? "这是游戏的结束界面，您可以自定义这的开始按钮、页面背景，还可以添加一段文字流" 
        :""}}</div> -->

    <!-- 游戏容器 -->
    <div class="preViewGameContainer" v-bind:style="gameDimension"></div>
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

export default {
  name: "previewPage",
  mounted() {
    this.levelSetting[0].backgroundImage =
      pics["./previewLevelBackground1.jpg"];
    this.levelSetting[1].backgroundImage =
      pics["./previewLevelBackground2.png"];
    this.globalSetting.playerSprites = pics["./previewPagePlayer.png"];
    this.startPictureComponents[0].url = pics["./DIYGAMElogo.png"];

    this.responsiveInit();
    window.addEventListener("resize", this.resizeTheStartUpFace);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeTheStartUpFace);
  },
  computed:{
    lang(){
      return this.$store.state.lang
    }
  },
  data: function() {
    return {
      levelMap,
      levelSetting,
      globalSetting,
      startUpBtnText,
      startUpBtn: JSON.parse(JSON.stringify(startUpBtn)),
      startBackgroundStyle: JSON.parse(JSON.stringify(startBackgroundStyle)),
      startTextComponents: JSON.parse(JSON.stringify(startTextComponents)),
      startPictureComponents: JSON.parse(
        JSON.stringify(startPictureComponents)
      ),
      endBackgroundStyle: JSON.parse(JSON.stringify(endBackgroundStyle)),
      processTextFlow: JSON.parse(JSON.stringify(processTextFlow)),
      runningGame: false,
      gameEnd: false,
      doneLoading: true,
      gameDimension: {
        width: "700px",
        height: "400px",
        margin: "auto",
        position: "relative"
      }
    };
  },
  methods: {
    async startGame() {
      this.runningGame = new Game(
        document.querySelector(".preViewGameContainer")
      );
      await this.runningGame.runGame(levelMap, levelSetting, globalSetting);
      this.gameEnd = true;
      window.scrollTo(0, 0);
      if (this.is_touch_device()) {
        Array.from(
          document.querySelector(".preViewGameContainer").children
        ).forEach(child => child.remove());
      }
      this.gameEndAnimation();
    },
    resizeTheStartUpFace() {
      if (this.runningGame !== false && this.gameEnd != true) return;
      this.responsiveInit();
    },
    screenDimension() {
      //获得屏幕界面
      return {
        width: window.innerWidth - 20,
        height: window.innerHeight
      };
    },
    is_touch_device() {
      return (
        "ontouchstart" in window ||
        navigator.MaxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    },
    responsiveInit() {
      //界面responsive
      let { width, height } = this.screenDimension();
      //先修改游戏界面
      this.gameDimension.width = width + "px";
      this.gameDimension.height = height + "px";
      //根据width height按比率调整长宽
      let ratio = height / width;
      let adjRatio = 1;
      if (ratio > 400 / 700) {
        //依赖宽来定义size
        adjRatio = width / 700;
        //改变container的宽
        this.$set(
          this.startBackgroundStyle,
          "width",
          this.pixelTypeTransfer(width)
        );
        this.$set(
          this.startBackgroundStyle,
          "height",
          this.pixelTypeTransfer(400 * adjRatio)
        );
        this.$set(
          this.endBackgroundStyle,
          "width",
          this.pixelTypeTransfer(width)
        );
        this.$set(
          this.endBackgroundStyle,
          "height",
          this.pixelTypeTransfer(400 * adjRatio)
        );
      } else {
        //依赖长来定义size
        adjRatio = height / 400;
        this.$set(
          this.startBackgroundStyle,
          "width",
          this.pixelTypeTransfer(700 * adjRatio)
        );
        this.$set(
          this.startBackgroundStyle,
          "height",
          this.pixelTypeTransfer(height)
        );
        this.$set(
          this.endBackgroundStyle,
          "width",
          this.pixelTypeTransfer(700 * adjRatio)
        );
        this.$set(
          this.endBackgroundStyle,
          "height",
          this.pixelTypeTransfer(height)
        );
      }

      mutateProp(this.startUpBtn, startUpBtn, this);
      mutateProp(
        this.startTextComponents[0].style,
        startTextComponents[0].style,
        this
      );
      mutateProp(
        this.startPictureComponents[0].style,
        startPictureComponents[0].style,
        this
      );
      mutateProp(
        this.startPictureComponents[0],
        startPictureComponents[0],
        this
      );
      mutateProp(this.processTextFlow.style, processTextFlow.style, this);

      function mutateProp(item, base, self) {
        ["top", "left", "width", "height", "fontSize"].forEach(property => {
          if (item[property] != undefined)
            item[property] =
              typeof item[property] == "string"
                ? self.pixelTypeTransfer(base[property]) * adjRatio + "px"
                : base[property] * adjRatio;
        });
      }
    },
    pixelTypeTransfer(value) {
      if (typeof value == "string") {
        return Number(value.match(/-?\d+/)[0]);
      } else {
        return value + "px";
      }
    },
    gameEndAnimation() {
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
  text-align: center;
}

.startUpFace {
  margin: auto;
  position: relative;
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
  background-image: url("../pic/preViewPage/endFaceBackground.jpg");
}
</style>