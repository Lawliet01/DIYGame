<template>
  <div id="structureDesign">
    <!-- leftContainer -->
    <div class="leftContainer">
      <div class="panel">
        <table
          class="map"
          @mousedown.prevent.stop="mutateGrids($event)"
          :style="{transform:`scale(${mapScale})`}"
        >
          <tr v-for="(_,rowIndex) in map" :key="'row'+rowIndex">
            <td
              v-for="(_,gridIndex) in map[0]"
              class="grid"
              :key="'row'+rowIndex+'-'+'grid'+gridIndex"
              :name="rowIndex+'-'+gridIndex"
              :style="{backgroundImage:map[rowIndex][gridIndex].backgroundImage,
                      borderStyle:showGrid==true?'solid':'none'}"
            ></td>
          </tr>
        </table>
      </div>
    </div>

    <!-- rightContainer -->
    <div class="rightContainer">

      <!-- optionList -->
      <div class="extendButton" @click="extendPanel.optionsList = !extendPanel.optionsList">游戏元素</div>
      <div class="optionsListContainer" v-show="extendPanel.optionsList">
        <div
          class="currentOption"
          :style="{backgroundImage:`url(${selectedOption.src})`}"
          @click="cancelSelect()"
        >
          <span v-show="selectedOption.pattern != '.'" class="closeBtn">&Cross;</span>
        </div>
        <div class="selector">
          <div class="selectorComponent" v-for="(selector,index) in selectorList" :key="selector">
            <div class="selectorTitle" :class="'selector-'+selector">{{selectorChineseName[index]}}</div>
            <div class="options">
              <div
                v-for="(option,opIndex) in optionsForSelector[selector]"
                :key="selector+opIndex"
                :style="optionStyle(option)"
                @click="selectedOption = option"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- setting -->
      <div class="extendButton" @click="extendPanel.setting = !extendPanel.setting">面板操作</div>
      <div class="setting" v-show = 'extendPanel.setting'>
        <div>
          <input type="range" v-model="mapScale" min="0.2" max="1.5" step="0.1">
        </div>
        <div class="resize">
          长：
          <input type="text" v-model.number="dimension.width" @change="changeDimension()">
          宽：
          <input type="text" v-model.number="dimension.height" @change="changeDimension()">
        </div>
        <div class="gridLine">
          网格：
          <input type="checkbox" v-model="showGrid">
        </div>
        <div class="undoBtn" @click="undo()">撤销</div>
        <div class="resetBtn" @click="reset()">重置</div>
        <div class="clearBtn" @click="clear()">清空界面</div>
      </div>

      <!-- template -->
      <div class="extendButton" @click="extendPanel.template = !extendPanel.template">游戏模版</div>
      <div class="template" v-show='extendPanel.template'>
        <div
          v-for="(template,index) in templates"
          :key="'template'+index"
          @click="useTemplate(template)"
        >模版{{index+1}}</div>
      </div>
      <div class="cancelBtn" @click="cancel()">取消</div>
      <div class="doneBtn" @click="done()">完成</div>
    </div>
  </div>
</template>

<script>
//开发使用
import gameTemplate from "@/lib/levelTemplate.js";
import { stringToMap, mapToString } from "./lib/transversion.js";
import { mapState } from "vuex";

let pics = {};
importAll(require.context("@/pic/structureComponent/", false, /\.png$/));

function importAll(r) {
  r.keys().forEach(key => {
    let name = key.match(/\/(\w+)[.].*/)[1];
    if (name == null) throw new Error("wrong match on:" + key);
    pics[name] = r(key);
  });
}

export default {
  name: "structureDesign",
  mounted: function() {
    //初始赋值
    this.reset();
  },
  data: function() {
    return {
      map: [],
      dimension: {
        width: 0,
        height: 0
      },
      selectorChineseName: ["玩家", "墙体", "怪兽", "金币", "熔浆"],
      selectorList: ["players", "walls", "monsters", "collectors", "lava"],
      selectedOption: { src: "", pattern: "." },
      optionsForSelector: {
        walls: [this.createOption("wallIcon", "#")],
        players: [this.createOption("playerIcon", "@")],
        monsters: [
          this.createOption("monsterIcon", "m"),
          this.createOption("dragonIcon", "d")
        ],
        collectors: [this.createOption("coinIcon", "o")],
        lava: [
          this.createOption("lavaIcon1", "+"),
          this.createOption("lavaIcon2", "="),
          this.createOption("lavaIcon3", "|"),
          this.createOption("lavaIcon4", "v")
        ]
      },
      mapScale: 1,
      showGrid: true,
      editHistory: [],
      templates: gameTemplate,
      extendPanel: {
        optionsList: true,
        setting: true,
        template: false
      }
    };
  },
  computed: {
    ...mapState("gameLevel", ["levelMap", "currentLevel"])
  },
  methods: {
    optionStyle(option) {
      let opacity = 0.6;
      if (option.pattern == this.selectedOption.pattern) {
        opacity = 1;
      }
      return {
        backgroundImage: "url(" + option.src + ")",
        opacity: opacity
      };
    },
    cancel() {
      this.$store.commit("gameLevel/toggleStructureDesign");
    },
    done() {
      let map = mapToString(this.map);
      let countPlayer = (map.match(/@/g)||[]).length
      let countCoin = (map.match(/o/g)||[]).length
      if(countPlayer != 1){
        alert('必须有且只有一个玩家')
        return;
      }
      if(countCoin == 0){
        alert('没有金币的情况下该等级可能无法通关！')
      }
      this.$store.commit("gameLevel/changeGameMap", mapToString(this.map));
      this.$store.commit("gameLevel/toggleStructureDesign");
    },
    createOption(srcName, pattern) {
      return {
        src: pics[srcName],
        pattern: pattern
      };
    },
    mutateGrids(event) {
      let self = this;
      let map = document.getElementsByClassName("map")[0];
      startMutate(event);
      map.addEventListener("mousemove", startMutate);
      function startMutate(event) {
        if (event.buttons == 0) {
          map.removeEventListener("mousemove", startMutate);
          //如果图案改变，就更新历史
          self.updateHistory();
        } else {
          let index = event.target.getAttribute("name");
          let [, y, x] = index.match(/(\d+)-(\d+)/);
          self.mutateGrid(y, x);
        }

        return;
      }
    },
    mutateGrid(y, x) {
      let { src, pattern } = this.selectedOption;
      let targetGrid = this.map[y][x];
      if (pattern == targetGrid.pattern) return;
      targetGrid.backgroundImage = `url(${src})`;
      targetGrid.pattern = pattern;
      return;
    },
    changeDimension() {
      let { width, height } = this.dimension;
      if (width > 150 || height > 150){
        alert('边长不能超过150')
        return;
      }
      if (typeof width != "number" || typeof height != "number") {
        //限制输入
        alert("wrong inpit");
        return;
      }
      let widthDiff = width - this.map[0].length;
      let heightDiff = height - this.map.length;
      if (widthDiff < 0) {
        this.map.forEach(row => row.splice(width));
      } else if (widthDiff > 0) {
        let newPart = Array.apply(null, { length: widthDiff }).map(function() {
          return {
            backgroundImage: "",
            pattern: "."
          };
        });
        this.map = this.map.map(row => {
          return row.concat(newPart);
        });
      }
      if (heightDiff < 0) {
        //从头部开始剪切
        this.map.splice(0, Math.abs(heightDiff));
      } else if (heightDiff > 0) {
        let newPart = Array.apply(null, { length: heightDiff }).map(function() {
          return Array.apply(null, { length: width }).map(function() {
            return {
              backgroundImage: "",
              pattern: "."
            };
          });
        });
        this.map = newPart.concat(this.map);
      }
      this.updateHistory();
      return;
    },
    updateHistory() {
      let mapString = mapToString(this.map);
      if (mapString == this.editHistory[0]) return;
      this.editHistory.unshift(mapString);
      if (this.editHistory.length > 20) this.editHistory.pop();
      return;
    },
    undo() {
      if (this.editHistory.length < 2) return;
      this.editHistory.shift();
      this.map = stringToMap(this.editHistory[0], pics);
      return;
    },
    reset() {
      let level = this.levelMap[this.currentLevel];
      this.map = stringToMap(level, pics);
      this.dimension.width = this.map[0].length;
      this.dimension.height = this.map.length;
      this.updateHistory();
    },
    clear() {
      let self = this;
      let emptyMap = Array.apply(null, { length: this.dimension.height }).map(
        function() {
          return Array.apply(null, { length: self.dimension.width }).map(
            function() {
              return {
                backgroundImage: "",
                pattern: "."
              };
            }
          );
        }
      );
      this.map = emptyMap;
      this.updateHistory();
      return;
    },
    useTemplate(template) {
      this.map = stringToMap(template, pics);
      this.dimension.width = this.map[0].length;
      this.dimension.height = this.map.length;
      return;
    },
    cancelSelect() {
      this.selectedOption = { src: "", pattern: "." };
    }
  }
};
</script>

<style scoped lang='scss'>
//todo: 单独修改每一个option的样式（金币要小一点，人头要小一点。。。）

$left-flex: 75%;
$optionList-height: 25px;
$font-color: #247799;

%flex-item-children {
  border: 1px solid lightblue;
}

@mixin backgroundAdj($width) {
  background-position: center;
  background-repeat: no-repeat;
  background-size: $width $width;
}

@mixin hover-effect {
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

* {
  box-sizing: border-box;
}

#structureDesign {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.95;
  padding-top: 10px;
  display: flex;
  flex-flow: nowrap;

  .leftContainer {
    overflow: scroll;
    flex: $left-flex;
    padding-left: 10px;
    & > div {
      @extend %flex-item-children;
    }
  }
  .rightContainer {
    color: $font-color;
    flex: 0 0 200px;
    padding: 0px 10px;
    & > div {
      margin-bottom: 10px;
      @extend %flex-item-children;
    }
    .extendButton {
      margin-bottom:0;
      border-bottom:0;
      background-color:red;
      color:white;
      &:hover{
        cursor:pointer;
        opacity: 0.7;
      }
    }
  }
}

// panel
.panel {
  overflow: scroll;
  height: 90%;

  .map {
    border-collapse: collapse;
  }

  .grid {
    $gridWidth: 30px;
    min-width: $gridWidth;
    height: $gridWidth;
    border-width: 0.5px;
    border-color: lightblue;
    background-color: rgb(52, 166, 251);
    @include backgroundAdj($gridWidth);
    @include hover-effect();
  }
}
//optionslist
.optionsListContainer {
  height: 280px;
  text-align: left;
  position: relative;
  padding: 10px;

  $currentOptionWidth: 70px;

  .currentOption {
    position: relative;
    margin: 10px auto 20px auto;
    width: $currentOptionWidth;
    height: $currentOptionWidth;
    border: 1px solid rgb(243, 69, 69);
    @include backgroundAdj($currentOptionWidth - 10px);
    @include hover-effect();
    .closeBtn {
      position: absolute;
      top: 0;
      right: 0;
      color: red;
      font-size: 50px;
      line-height: 10px;
    }
  }

  .selector {
    height: $optionList-height - 2px;
    z-index: 1;
    margin-top: 10px;

    .selectorComponent {
      height: $optionList-height;
      margin-top: 5px;

      .selectorTitle {
        width: 30%;
        vertical-align: top;
        line-height: $optionList-height;
        display: inline-block;
      }

      .options {
        height: 100%;
        display: inline-block;

        div {
          display: inline-block;
          width: $optionList-height;
          height: 100%;
          @include backgroundAdj($optionList-height);
          transition: all 0.1s;
          &:hover {
            cursor: pointer;
            transform: scale(1.3);
          }
        }
      }
    }
  }
}

//setting
.setting {
  height: 220px;
  padding: 10px;

  div {
    padding: 5px;
  }
  .resize {
    input {
      width: 30px;
    }
  }

  .undoBtn,
  .resetBtn,
  .clearBtn {
    border: 1px solid $font-color;
    margin: 5px 10px;
    padding: 0 5px;
    transition: all 0.2s;
    &:hover {
      cursor: pointer;
      background-color: $font-color;
      color: red;
    }
  }
}

//template
.template {
  height: 120px;
  padding-top: 10px;

  div {
    display: inline-block;
    border: 1px solid $font-color;
    margin: 5px 10px;
    padding: 0 5px;
    transition: all 0.2s;
    &:hover {
      cursor: pointer;
      background-color: $font-color;
      color: red;
    }
  }
}

//otherBtns
.cancelBtn {
  height: 30px;
  line-height:30px;
  margin-top:5px;
  &:hover {
      cursor: pointer;
      background-color: $font-color;
      color: red;
    }
}

.doneBtn {
  @extend .cancelBtn;
}
</style>

