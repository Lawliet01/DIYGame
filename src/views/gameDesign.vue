<template>
  <div id="gameDesignContainer">
    <!-- leftContainer -->
    <div class="leftContainer">
      <div class="gameLevelListContainer">
        <div class="gameList">
          <div
            class="levelBlock"
            v-for="(_,index) in levelMap"
            :key="'block'+index"
            @click="changeToNewLevel(index)"
            :style="currentBlockStyle(index)"
          >L{{index+1}}</div>
          <button class="addLevelBtn" @click="addNewLevel()">
            <font-awesome-icon icon="plus"/>
          </button>
        </div>
      </div>
      <div class="gamePreviewContainer"></div>
    </div>

    <!-- rightConatiner -->
    <div class="rightConatiner">
      <div class="returnBtnContainer">
        <button class="returnBtn" @click="returnToEntireGame()">完成</button>
      </div>
      <div class="operationalContainer">
        <div class="choices">
          <button class="backgroundSettingBtn" @click="mode='backgroundSetting'">背景</button>
          <button class="propertySettingBtn" @click="mode='propertySetting'">游戏属性</button>
        </div>
        <div class="settingContainer">
          <div class="backgroundSettingPanel" v-if="mode=='backgroundSetting'">
            <br>更换背景颜色：
            <br>
            <br>
            <input
              type="color"
              :value="backgroundColor"
              @change="changeNewBackgroundColor($event.target.value)"
              class="colorInput"
            >
            <br>
            <br>
            <hr>
            <br>更换背景图片：
            <br>
            <br>
            <button @click="inputBackgroundImage" class="backgroundInput">导入背景</button>
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
              step="1"
              :value="globalPlayerSetting.speed"
              @change="changePlayerSetting($event.target.value,'speed')"
            >
            <br>弹跳
            <input
              type="range"
              class="playerJumpSpeed"
              min="10"
              max="30"
              step="1"
              :value="globalPlayerSetting.jumpSpeed"
              @change="changePlayerSetting($event.target.value,'jumpSpeed')"
            >
            <br>大小
            <input
              type="range"
              class="playerSize"
              min="0.7"
              max="2"
              step="0.1"
              :value="globalPlayerSetting.size"
              @input="changePlayerSetting($event.target.value,'size')"
              @change="runGame()"
            >
            <hr>
          </div>
        </div>
      </div>
      <button class="structureDesign" @click="openStructureDesign()">
        <font-awesome-icon icon="cogs" class="fa-sm"/>&nbsp;结构设计
      </button>
    </div>
    <transition name="pageTransition">
      <structure-design v-if="structureDesign == true"></structure-design>
    </transition>
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
      if (
        this.structureDesign == true &&
        this.gamePreviewContainer.children[0] != undefined
      ) {
        //因为stopGame只会直接帮游戏通关，但是暂停时的游戏的流动断了
        //所以避免暂停的情况下进入structureDesign，回来后出现了两个游戏
        this.gamePreviewContainer.children[0].remove();
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
          backgroundColor: "red",
          color: "white"
        };
      } else {
        return {
          backgroundColor: "",
          color: "black"
        };
      }
    },
    async runGame() {
      if (this.runningGame != null) this.runningGame.stopGame();
      this.runningGame = new Game(this.gamePreviewContainer);
      let killGame = await this.runningGame.runGame(
        [this.levelMap[this.currentLevel]],
        [this.levelSetting[this.currentLevel]],
        this.globalPlayerSetting
      );
      if (killGame == false) {
        //如果是因为游戏赢了才结束，那就重启游戏
        this.runGame();
      }
    },
    changeToNewLevel(index) {
      this.changeLevel(index);
      this.runGame();
    },
    addNewLevel() {
      if (this.levelMap.length > 19) {
        alert("最高不能超过20关");
        return;
      }
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
            this.runningGame.mutate({ backgroundImage: reader.result });
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
    changePlayerSetting(value, key) {
      let valuePair = {};
      valuePair[key] = Number(value);
      this.changeGlobalPlayerSetting(valuePair);
      this.runningGame.mutate(valuePair);
    },
    returnToEntireGame() {
      this.$router.push("/entireGame");
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

@import "../lib/_consistentStyle.scss";

$previewWidth: 700px;
$previewHeight: 400px;
$levelListHeight: 25px;
$borderStyle: 1px solid lightblue;
@mixin hover-effect {
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

#gameDesignContainer {
  margin: auto;
  width: 910px;
  display: flex;
  flex-flow: row nowrap;
  padding-top: 50px;

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
      transition: all 0.3s;
      &:hover {
        cursor: pointer;
        color: white;
        background-color: red;
      }
    }

    .addLevelBtn {
      position: absolute;
      right: 0;
      height: 100%;
      @include hover-effect();
    }
  }
}

$rightContainerWidth: 200px;

.returnBtnContainer {
  width: $rightContainerWidth;
  height: $levelListHeight;
  margin: auto;
  transition: all 0.3s;
  font-weight: 700;
  .returnBtn {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    &:hover {
      cursor: pointer;
      background-color: red;
      color: white;
    }
  }
}

.gamePreviewContainer {
  margin-right: 0;
}

.operationalContainer {
  width: $rightContainerWidth;
  margin: auto;
  padding-top: 5px;

  .backgroundSettingBtn {
    width: 50%;
    height: 20px;
    border: $borderStyle;
    border-bottom: none;
    border-radius: 5px 5px 0 0;
    outline: none;
    &:hover {
      cursor: pointer;
      background-color: red;
      color: white;
    }
  }
  .propertySettingBtn {
    @extend .backgroundSettingBtn;
  }
  .settingContainer {
    background-color: white;
    height: 300px;
    border: $borderStyle;
    border-top: none;
    padding: 10px 20px;
    .backgroundInput {
      @include buttonStyle(100px, 20px);
    }
    .propertySetting {
      padding-top: 10px;
      input {
        width: 70px;
      }
    }
  }
}

.structureDesign {
  margin: auto;
  font-weight: 700;
  margin-top: 5px;
  color: red;
  background-color: antiquewhite;
  @include buttonStyle($rightContainerWidth, $levelListHeight);
}
</style>



