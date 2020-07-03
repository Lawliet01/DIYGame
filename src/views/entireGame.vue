<template>
  <div id="entireGame">
    <div
      v-if="runningGame!=null&&gameEnd==false"
      style="font-size:15px;color:red;font-weight:600"
    >{{lang === 1 ? "上、左、右键移动角色，esc键暂停" : "Press [left,right,up] key to move player. Press 「esc」key to pause the game."}}</div>
    <!-- 开始界面 -->
    <div class="startUpFace" v-bind:style="backgroundStyle" v-if="runningGame==null">
      <button v-bind:style="startUpBtn" v-on:click="startGame()">{{startUpBtnText}}</button>
      <div
        class="textItem"
        v-for="(item,index) in processTextComponent"
        :key="'textItem' + index"
        :style="item.style"
      >{{item.textContent}}</div>
      <div
        class="imgItem"
        v-for="(item,index) in processPictureComponent"
        :key="'pictureItem' + index"
        :style="item.style"
      >
        <img :src="item.url" :width="item.width">
      </div>
    </div>

    <!-- 结束界面 -->
    <div class="endFace" v-bind:style="endBackgroundStyle" v-if="gameEnd">
      <pre class="textFlow" v-bind:style="textFlowRealTimeStyle">{{endProcessTextFlow.textContent}}</pre>
      <div
        class="textItem"
        v-for="(item,index) in endProcessTextComponent"
        :key="'textItem' + index"
        :style="item.style"
      >{{item.textContent}}</div>
      <div
        class="imgItem"
        v-for="(item,index) in endProcessPictureComponent"
        :key="'pictureItem' + index"
        :style="item.style"
      >
        <img :src="item.url" :width="item.width">
      </div>
    </div>

    <div class="gameContainer"></div>

    <!-- 按键组 -->
    <div class="btnGroup">
      <button @click="goToPlayerFigureDesign()" class="designBtn">
        <font-awesome-icon icon="male" class="fa-lg"/>&nbsp;{{lang===1?"角色设计":"Player"}}
      </button>
      <button @click="goToGameDesign()" class="designBtn">
        <font-awesome-icon icon="gamepad" class="fa-lg"/>&nbsp;{{lang===1?"游戏设计":"Level"}}
      </button>
      <button @click="goToStartUpAndEndDesign()" class="designBtn">
        <font-awesome-icon icon="laptop" class="fa-lg"/>&nbsp;{{lang===1?"界面设计":"Interface"}}
      </button>
      <button @click="reset()">{{!gameEnd?`${lang===1?"结束游戏":"reset"}`:`${lang === 1 ?"重置游戏":"reset"}`}}</button>
      <button @click="save()">{{lang === 1 ?"保存":"save"}}</button>
      <button @click="restore()">{{lang === 1 ?"恢复":"restore"}}</button>
      <button @click="downloadTheGame()">{{lang === 1 ? "下载":"download"}}</button>
    </div>

    <!-- 下载弹出框 -->
    <div class="downLoadConfirm"></div>
  </div>
</template>

<script>
import Game from "../lib/pureGame";
import gameLevel from "../lib/gameLevel";
import { mapState, mapGetters} from "vuex";
import gameTemplate from "@/lib/gameTemplate";
import mobileRouterDevice from "@/lib/mobileRouterProtect";

let pics = {};
importAll(require.context("../pic/pureGame/", false, /\.png$/));
function importAll(r) {
  r.keys().forEach(key => (pics[key] = r(key)));
}

export default {
  name: "entrieGame",
  mixins: [mobileRouterDevice],
  beforeRouteLeave(to, from, next) {
    if (this.runningGame == null) {
      next();
      return;
    }
    this.runningGame.stopGame();
    next();
  },
  beforeRouteEnter(from,to,next){
    //ie浏览器下不允许
    function isIE() {
      let ua = navigator.userAgent;
      var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

      return is_ie;
    }
    if (isIE()) {
      alert('抱歉，目前不支持该浏览器，可以使用Chrome,Edge,Opera,Firefox,Safari等浏览器')
      next(false)
    }else{
      next()
    }
  },
  mounted() {
    this.textFlowRealTimeStyle = JSON.parse(
      JSON.stringify(this.endProcessTextFlow.style)
    );
  },
  data: function() {
    return {
      runningGame: null,
      gameEnd: false,
      textFlowRealTimeStyle: null
    };
  },
  watch: {
    gameEnd() {
      if (this.gameEnd == false) return;
      this.textFlowRealTimeStyle.top = this.endProcessTextFlow.style.top;
      this.textFlowRealTimeStyle.left = this.endProcessTextFlow.style.left;
      let {
        animation,
        animationTime,
        animationDistance,
        animationDir
      } = this.endProcessTextFlow.animate;
      if (animation == false || animationTime == 0 || animationDistance == 0)
        return;
      let time = animationTime * 1000;
      let start = 0;
      if (animationDir == "top" || animationDir == "bottom") {
        let distance =
          animationDir == "top" ? -1 * animationDistance : animationDistance;
        let animate = setInterval(() => {
          this.textFlowRealTimeStyle.top =
            this.pixelTypeTransfer(this.textFlowRealTimeStyle.top) +
            (distance / time) * 60 +
            "px";
          start += 60;
          if (start > time) clearInterval(animate);
        }, 60);
      } else {
        let distance =
          animationDir == "left" ? -1 * animationDistance : animationDistance;
        let animate = setInterval(() => {
          this.textFlowRealTimeStyle.left =
            this.pixelTypeTransfer(this.textFlowRealTimeStyle.left) +
            (distance / time) * 60 +
            "px";
          start += 60;
          if (start > time) clearInterval(animate);
        }, 60);
      }
    }
  },
  computed: {
    ...mapState("playerFigure", {
      playerFigureImgData: "imgData",
      playerFigureWidth: null
    }),
    ...mapState("gameLevel", [
      "levelMap",
      "levelSetting",
      "currentLevel",
      "structureDesign",
      "globalPlayerSetting"
    ]),
    ...mapState("startUpFace", [
      "startUpBtn",
      "backgroundStyle",
      "startUpBtnText"
    ]),
    ...mapGetters("startUpFace", [
      "processTextComponent",
      "processPictureComponent"
    ]),
    ...mapState("endFace", {
      endBackgroundStyle: "backgroundStyle"
    }),
    ...mapGetters("endFace", {
      endProcessTextComponent: "processTextComponent",
      endProcessPictureComponent: "processPictureComponent",
      endProcessTextFlow: "processTextFlow"
    }),
    gameContainer() {
      return document.querySelector(".gameContainer");
    },
    playerFigure() {
      let src = this.$store.state.playerFigure.result;
      if (src == null) return null;
      let image = new Image();
      image.src = this.$store.state.playerFigure.result;
      return image;
    },
    lang(){
      return this.$store.state.lang
    }
  },
  methods: {
    save() {
      store("gameLevel", this.$store.state.gameLevel);
      store("startUpFace", this.$store.state.startUpFace);
      store("endFace", this.$store.state.endFace);
      alert(`${this.lang === 1 ?"已保存!":"Saved!"}`);

      function store(name, data) {
        localStorage.setItem(name, JSON.stringify(data));
      }
    },
    restore() {
      restoreData("gameLevel", this);
      restoreData("startUpFace", this);
      restoreData("endFace", this);
      alert(`${this.lang === 1 ?"已恢复, 请重新开始游戏!":"Done! Please restart the game!"}`);
      function restoreData(name, self) {
        let data = localStorage.getItem(name);
        if (data != null)
          self.$store.commit(name + "/restoreData", JSON.parse(data));
      }
    },
    reset() {
      if (this.gameEnd == true) {
        //游戏已经结束
        this.gameEnd = false;
        this.runningGame = null;
        return;
      } else {
        //游戏正在进行中或还没有开始
        if (this.runningGame != null) this.runningGame.stopGame();
      }
    },
    pixelTypeTransfer(value) {
      if (typeof value == "string") {
        return Number(value.match(/-?\d+/)[0]);
      } else {
        return value + "px";
      }
    },
    async startGame() {
      let levelMap = this.levelMap.length == 0 ? gameLevel : this.levelMap;
      this.runningGame = new Game(this.gameContainer);
      await this.runningGame.runGame(
        levelMap,
        this.levelSetting,
        this.globalPlayerSetting
      );
      this.gameEnd = true;
    },
    goToPlayerFigureDesign() {
      this.$router.push("/playerFigure/combine");
    },
    goToGameDesign() {
      this.$router.push("/gameDesign");
    },
    goToStartUpAndEndDesign() {
      this.$router.push("/startUpAndEndDesign");
    },
    async downloadTheGame() {
      var gameName = window.prompt("输入游戏名称", "diyGame");
      if (gameName == null) return;
      let blob = new Blob(await manipulateHTML(gameTemplate, this), {
        text: "text/plain"
      });
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.setAttribute("href", url);
      link.setAttribute("download", gameName + ".html");
      link.click();
      link.remove();

      function manipulateHTML(htmlFile, self) {
        return new Promise(async resolve => {
          let otherSprites = await getImage("sprites.png", pics);
          let playerSprites = await getImage("player.png", pics);
          let monsterSprites = await getImage("Monster1.png", pics);
          let dragonSpritesSRC = await getImage("dragon.png", pics, 10);
          let fireSpritesSRC = await getImage("fire.png", pics, 4);
          let toFireSRC = await getImage("tofire.png", pics, 8);

          let result = applyChange(htmlFile, [
            {
              spot: "endFacebackgroundStyleToBeReplaced",
              value: self.endBackgroundStyle
            },
            {
              spot: "textFlowStyleFromVuexToBeReplaced",
              value: self.endProcessTextFlow.style
            },
            {
              spot: "textFlowAnimationFromVuexToBeReplaced",
              value: self.endProcessTextFlow.animate
            },
            {
              spot: "textFlowContentToBeReplaced",
              value: self.endProcessTextFlow.textContent
            },
            {
              spot: "endTextComponentsToBeReplace",
              value: self.endProcessTextComponent
            },
            {
              spot: "endPictureComponentsToBeReplace",
              value: self.endProcessPictureComponent
            },
            {
              spot: "pictureComponentsToBeReplace",
              value: self.processPictureComponent
            },
            {
              spot: "textComponentsToBeReplace",
              value: self.processTextComponent
            },
            {
              spot: "startUpFacebackgroundStyleToBeReplaced",
              value: self.backgroundStyle
            },
            {
              spot: "startBtnStyleToBeReplace",
              value: self.startUpBtn
            },
            {
              spot: "startUpBtnTextToBeReplace",
              value: self.startUpBtnText
            },
            {
              spot: "gameLevelToBeReplaced",
              value: self.levelMap.length == 0 ? gameLevel : self.levelMap
            },
            {
              spot: "gameSettingsToBeReplaced",
              value: self.levelSetting
            },
            {
              spot: "globalSettingsToBeReplaced",
              value: self.globalPlayerSetting
            },
            {
              spot: "spritesToBeReplaced",
              value: otherSprites
            },
            {
              spot: "playerToBeReplaced",
              value: playerSprites
            },
            {
              spot: "monsterToBeReplaced",
              value: monsterSprites
            },
            {
              spot: "drgonToBeReplaced",
              value: dragonSpritesSRC
            },
            {
              spot: "fileToBeReplaced",
              value: fireSpritesSRC
            },
            {
              spot: "dragonToFireToBeReplaced",
              value: toFireSRC
            }
          ]);
          resolve([result]);

          function getImage(name, requireContext, length) {
            //获得每个图的url
            if (length == undefined) {
              //先用canvas画出来，使用toDataURL获得url，然后最后去除canvas和image。
              let src = requireContext["./" + name];
              if (src == undefined) throw new Error("no such image");
              let image = new Image();
              image.src = src;
              return new Promise(resolve => {
                image.onload = () => {
                  let canvas = document.createElement("canvas");
                  canvas.width = image.width;
                  canvas.height = image.height;
                  let cx = canvas.getContext("2d");
                  document.body.appendChild(canvas);
                  cx.drawImage(image, 0, 0);
                  let url = canvas.toDataURL();
                  canvas.remove();
                  image.remove();
                  resolve(url);
                };
              });
            } else {
              return new Promise(resolve => {
                let pictureGroup = Array.apply(null, { length: length }).map(
                  function(_, index) {
                    let fileIndex = index + 1;
                    let fileName = name.replace(/[.]/, fileIndex + ".");
                    return getImage(fileName, requireContext);
                  }
                );
                Promise.all(pictureGroup).then(result => resolve(result));
              });
            }
          }
          function applyChange(file, changes) {
            for (let change of changes) {
              file = file.replace(
                new RegExp(change.spot),
                JSON.stringify(change.value)
              );
            }
            return file;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../lib/_consistentStyle";

#entireGame {
  padding-top: 50px;
}

.gameContainer {
  padding: 0;
}

.btnGroup {
  width: 700px;
  min-width: 700px;
  margin: auto;
  button {
    @include buttonStyle(14.28%, 25px);
    border-radius: 0px;
    background-color: #f1f1f1;
    &:hover {
      outline: none;
    }
    &:focus {
      outline: none;
    }
  }
  .designBtn {
    color: #3f51b5;
    font-weight: bold;
  }
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
}
</style>


