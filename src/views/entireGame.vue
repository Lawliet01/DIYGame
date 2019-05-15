<template>
  <div id="entireGame">
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
    <div class="gameContainer"></div>
    <button @click="goToPlayerFigureDesign()" class="playerFigureDesign">人物形象设计</button>
    <button @click="goToGameDesign()">游戏级别设计</button>
    <button @click="goToStartUpAndEndDesign()">开始结束界面设计</button>
    <button @click="downloadTheGame()">完成并下载</button>
  </div>
</template>

<script>
import Game from "../lib/pureGame";
import gameLevel from "../lib/gameLevel";
import { mapState, mapGetters } from "vuex";
import gameTemplate from "@/lib/gameTemplate";
import { doesNotThrow } from "assert";

let pics = {};
importAll(require.context("../pic/pureGame/", false, /\.png$/));
function importAll(r) {
  r.keys().forEach(key => (pics[key] = r(key)));
}

export default {
  name: "entrieGame",
  beforeRouteLeave(to, from, next) {
    if (this.runningGame == null) {
      next();
      return;
    }
    this.runningGame.stopGame();
    next();
  },
  data: function() {
    return {
      runningGame: null
    };
  },
  computed: {
    ...mapState("gameLevel", [
      "levelMap",
      "levelSetting",
      "currentLevel",
      "structureDesign",
      "globalPlayerSetting"
    ]),
    ...mapState("startUpFace", [
      "startUpBtn",
      "pictureComponents",
      "backgroundStyle",
      "startUpBtnText"
    ]),
    ...mapGetters("startUpFace", [
      "processTextComponent",
      "processPictureComponent"
    ]),
    gameContainer() {
      return document.querySelector(".gameContainer");
    },
    playerFigure() {
      let src = this.$store.state.playerFigure.result;
      if (src == null) return null;
      let image = new Image();
      image.src = this.$store.state.playerFigure.result;
      return image;
    }
  },
  methods: {
    startGame() {
      let levelMap = this.levelMap.length == 0 ? gameLevel : this.levelMap;
      this.runningGame = new Game(this.gameContainer);
      this.runningGame.runGame(
        levelMap,
        this.levelSetting,
        this.globalPlayerSetting
      );
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
      var confirm = window.confirm("已经完成设计并要下载该游戏了吗？");
      if (confirm == false) return;
      let blob = new Blob(await manipulateHTML(gameTemplate, this), {
        text: "text/plain"
      });
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "DIYGame.html");
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
          
          let result = applyChange(htmlFile,[
            {
              spot:"pictureComponentsToBeReplace",
              value:self.processPictureComponent
            },
            {
              spot:"textComponentsToBeReplace",
              value:self.processTextComponent
            },
            {
              spot:"startUpFacebackgroundStyleToBeReplaced",
              value:self.backgroundStyle
            },
            {
              spot:"startBtnStyleToBeReplace",
              value:self.startUpBtn
            },
            {
              spot:"startUpBtnTextToBeReplace",
              value:self.startUpBtnText
            },
            {
              spot:"gameLevelToBeReplaced",
              value:self.levelMap.length == 0 ? gameLevel : self.levelMap
            },
            {
              spot:"gameSettingsToBeReplaced",
              value:self.levelSetting
            },
            {
              spot:"globalSettingsToBeReplaced",
              value:self.globalPlayerSetting
            },
            {
              spot:"spritesToBeReplaced",
              value:otherSprites
            },
            {
              spot:"playerToBeReplaced",
              value:playerSprites
            },
            {
              spot:"monsterToBeReplaced",
              value:monsterSprites
            },
            {
              spot:"drgonToBeReplaced",
              value:dragonSpritesSRC
            },
            {
              spot:"fileToBeReplaced",
              value:fireSpritesSRC
            },
            {
              spot:"dragonToFireToBeReplaced",
              value:toFireSRC
            },
          ])
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
                Promise.all(pictureGroup).then(result=>resolve(result))
              });
            }
          }
          function applyChange(file,changes){
            for (let change of changes){
              file = file.replace(new RegExp(change.spot),JSON.stringify(change.value))
            }
            return file
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../lib/_consistentStyle";

.gameContainer {
  padding: 0;
}

button {
  @include buttonStyle(150px, 25px);
  margin: 0px 5px;
}

.startUpFace {
  margin: auto;
  position: relative;
  width: 700px;
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
</style>


