<template>
  <div id="gameDesignContainer">
    <div class="leftContainer">
      <div class="gameLevelListContainer">
        <div class="gameList">
          <div
            class="levelBlock"
            v-for="(_,index) in levelMap"
            :key="'block'+index"
            @click="changeToNewLevel(index)"
            :style="currentBlockStyle(index)"
          >level{{index+1}}</div>
          <button class="addLevelBtn" @click="addNewLevel()">添加</button>
        </div>
      </div>
      <div class="gamePreviewContainer"></div>
    </div>
    <div class="rightConatiner">
      <div class="returnBtnContainer">
        <button class="returnBtn">返回</button>
      </div>
      <div class="operationalContainer">
        <div class="settingContainer">
          <button class="backgroundSetting" @click="mode='backgroundSetting'">背景</button>
          <button class="propertySetting" @click="mode='propertySetting'">游戏属性</button>
          <div class="backgroundSettingPanel" v-if="mode=='backgroundSetting'">
            <input
              type="color"
              :value="backgroundColor"
              @change="changeNewBackgroundColor($event.target.value)"
            >
            <button @click="inputBackgroundImage">导入背景</button>
          </div>
          <div class="propertySetting" v-else>
            生命
            <input
              type="number"
              class="playerLives"
              :value="globalPlayerSetting.lives"
              @input="changePlayerSetting($event.target.value,'lives')"
            >
            <br>速度
            <input
              type="range"
              class="playerSpeed"
              min="5"
              max="15"
              :value="globalPlayerSetting.speed"
              @change="changePlayerSetting($event.target.value,'speed')"
            >
            <br>弹跳
            <input
              type="range"
              class="playerJumpSpeed"
              min="10"
              max="30"
              :value="globalPlayerSetting.jumpSpeed"
              @change="changePlayerSetting($event.target.value,'jumpSpeed')"
            >
            <br>
            <hr>
          </div>
        </div>
      </div>
      <button class="structureDesign" @click="openStructureDesign()">结构设计</button>
    </div>
    <structure-design v-if="structureDesign == true"></structure-design>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Game from "@/lib/pureGame";
import StructureDesign from "@/components/gameDesign/structureDesign";

export default {
  name: "gameDesign",
  beforeRouteLeave(to, from, next) {
    this.runningGame.stopGame();
    next();
  },
  mounted: function() {
    if (this.levelMap.length == 0) {
      this.$store.commit("gameLevel/addLevel");
    }
    this.runGame();
  },
  components: {
    StructureDesign
  },
  data: function() {
    return {
      runningGame: null,
      mode: "backgroundSetting",
      backgroundColor: "#34a6fb"
      // playerProperty:{
      //    lives:3,
      //    size: 1,
      //    speed:7,
      //    jumpSpeed:17
      // }
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
    gamePreviewContainer() {
      return document.getElementsByClassName("gamePreviewContainer")[0];
    }
  },
  watch: {
    structureDesign() {
      if (this.structureDesign == false) {
        this.runGame();
      }
    }
  },
  methods: {
    ...mapMutations("gameLevel", [
      "addLevel",
      "changeLevel",
      "toggleStructureDesign",
      "changeBackgroundColor",
      "changeBackgroundImage",
      "changeGlobalPlayerSetting"
    ]),
    currentBlockStyle(index) {
      if (index == this.currentLevel) {
        return {
          backgroundColor: "red"
        };
      } else {
        return {
          backgroundColor: ""
        };
      }
    },
    runGame() {
      if (this.runningGame != null) this.runningGame.stopGame();
      this.runningGame = new Game(this.gamePreviewContainer);
      this.runningGame.runGame([this.levelMap[this.currentLevel]]);
      this.runningGame.mutate(this.levelSetting[this.currentLevel]);
      this.runningGame.mutate(this.globalPlayerSetting);
    },
    changeToNewLevel(index) {
      this.changeLevel(index);
      this.runGame();
    },
    addNewLevel() {
      this.addLevel();
      this.runGame();
    },
    changeNewBackgroundColor(color) {
      this.changeBackgroundColor(color);
      this.runningGame.mutate({ backgroundColor: color });
    },
    inputBackgroundImage(event) {
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.addEventListener("change", () => {
        if (input.files[0] == null) {
          console.log("failed to load img");
        } else {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            this.changeBackgroundImage(reader.result);
            let image = new Image();
            image.src = reader.result;
            image.onload = () => {
              this.changeBackgroundImage(image);
              this.runningGame.mutate({ backgroundImage: image });
            };
          });
          reader.readAsDataURL(input.files[0]);
        }
      });
      input.click();
      input.remove();
    },
    openStructureDesign() {
      this.runningGame.stopGame();
      this.toggleStructureDesign();
    },
    changePlayerSetting(value,key) {
      let valuePair = {};
      valuePair[key] = Number(value)
      this.changeGlobalPlayerSetting(valuePair);
      this.runningGame.mutate(valuePair);
    },
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

$previewWidth: 700px;
$previewHeight: 400px;
$levelListHeight: 25px;
$borderStyle: 1px solid lightblue;
// $leftFlex: 75%;
// $rightFlex: 25%;
@mixin hover-effect {
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

#gameDesignContainer {
  display: flex;
  flex-flow: row nowrap;

  .leftContainer {
    flex: 75%;
  }
  .rightConatiner {
    flex: 25%;
  }
}

.gameLevelListContainer {
  .gameList {
    width: $previewWidth;
    height: $levelListHeight;
    border: $borderStyle;
    margin: auto;
    position: relative;
    text-align: left;

    .levelBlock {
      display: inline-block;
      height: 100%;
      padding: 0 3px;
      border-right: $borderStyle;
      line-height: $levelListHeight;
      @include hover-effect();
    }

    .addLevelBtn {
      position: absolute;
      right: 0;
      height: 100%;
    }
  }
}

.returnBtnContainer {
}

.gamePreviewContainer {
  margin-right: 0;
}

.operationalContainer {
  .settingContainer {
    margin-left: 5px;
    width: 200px;
    height: 350px;
    border: $borderStyle;
  }
}
</style>



