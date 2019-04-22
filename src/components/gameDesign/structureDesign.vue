<template>
  <div id="structureDesign">
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
            >
            </td>
          </tr>
        </table>
      </div>
      <div class="optionsList">
        <div class="selector">
          <div v-show="hover" @mouseleave="hover=false" class="selectorGroup">
            <div
              v-for="selector in selectorList"
              :key="selector"
              :class="'selector-'+selector"
              @click="selectedSelector = selector"
            >{{selector}}</div>
          </div>
          <div v-show="!hover" class="selectedSelector" @mouseover="hover=true">{{selectedSelector}}</div>
        </div>
        <div class="options">
          <div
            v-for="(option,index) in optionsForSelector[selectedSelector]"
            :key="selectedSelector+index"
            :style="{backgroundImage:'url('+option.src+')'}"
            @click="selectedOption = option"
          ></div>
        </div>
      </div>
    </div>
    <div class="rightContainer">
      <div class="setting">
        <div class="currentOption" :style="{backgroundImage:`url(${selectedOption.src})`}" @click="cancelSelect()">
          <span v-show="selectedOption.pattern != '.'" class='closeBtn'>&Cross;</span>
        </div>
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
        <div class="undoBtn" @click="undo()">undo</div>
        <div class="resetBtn" @click="reset()">reset</div>
        <div class="clearBtn" @click="clear()">clear</div>
      </div>
      <div class="template">
        <div
          v-for="(template,index) in templates"
          :key="'template'+index"
          @click="useTemplate(template)"
        >模版{{index+1}}</div>
      </div>
      <div class="cancelBtn">cancel</div>
      <div class="doneBtn" @click="done()">done</div>
    </div>
  </div>
</template>

<script>
//开发使用
import defaultGameLevel from "@/lib/gameLevel.js";
import gameTemplate from "@/lib/levelTemplate.js";
import { stringToMap, mapToString } from "./lib/transversion.js";
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
      selectorList: ["walls", "players", "monsters", "collectors", "lava"],
      selectedSelector: "walls",
      selectedOption: { src: "", pattern: "." },
      hover: false,
      optionsForSelector: {
        walls: [this.createOption("wallIcon", "#")],
        players: [this.createOption("playerIcon", "@")],
        monsters: [
          this.createOption("monsterIcon", "m"),
          this.createOption("dragonIcon", "d")
        ],
        collectors: [this.createOption("coinIcon", "o")],
        lava: [
          this.createOption("lavaIcon", "+"),
          this.createOption("lavaIcon", "="),
          this.createOption("lavaIcon", "|"),
          this.createOption("lavaIcon", "v")
        ]
      },
      mapScale: 1,
      showGrid: true,
      editHistory: [],
      templates: gameTemplate
    };
  },
  computed: {
    initalLevel() {
      //开始使用，最后应该通过store注入
      return null;
    },
  },
  methods: {
    done() {
      console.log(mapToString(this.map));
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
      if (typeof width != 'number'||typeof height != "number") {
        //限制输入
        alert('wrong inpit');
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
      let level =
        this.initalLevel == null ? defaultGameLevel[0] : this.initalLevel;
      this.map = stringToMap(level, pics);
      this.dimension.width = this.map[0].length;
      this.dimension.height = this.map.length
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
    cancelSelect(){
      this.selectedOption = {src:"",pattern:"."}
    }
  }
};
</script>

<style scoped lang='scss'>
//todo: 单独修改每一个option的样式（金币要小一点，人头要小一点。。。）

$left-flex: 75%;
$optionList-height: 40px;

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

@mixin options($backgroundColor) {
  display: inline-block;
  height: 100%;
  line-height: $optionList-height;
  padding: 0px 5px;
  border: 1px solid rgb(218, 210, 98);
  background-color: $backgroundColor;
  @include hover-effect();
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
    flex: 100% - $left-flex;
    padding: 0px 10px;
    & > div {
      margin-bottom: 10px;
      @extend %flex-item-children;
    }
  }
}

.panel {
  overflow: scroll;
  height: 90%;

  .map {
    border-collapse: collapse;
  }

  .grid {
    min-width: 40px;
    height: 40px;
    border-width: 0.5px;
    border-color: lightblue;
    background-color: rgb(52, 166, 251);
    @include backgroundAdj($optionList-height);
    @include hover-effect();
  }
}

.optionsList {
  height: $optionList-height;
  text-align: left;
  position: relative;

  .selector {
    display: inline-block;
    height: $optionList-height - 2px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    .selectorGroup {
      height: 100%;

      @each $selector in walls players monsters collectors lava {
        .selector-#{$selector} {
          @include options(rgb(230, 233, 47));
        }
      }
    }
    .selectedSelector {
      @include options(rgb(192, 72, 72));
    }
  }

  .options {
    display: inline-block;
    height: 100%;
    position: absolute;
    top: 0;
    left: 2 * $optionList-height;

    div {
      display: inline-block;
      width: $optionList-height;
      height: 100%;
      @include backgroundAdj($optionList-height);
      @include hover-effect();
    }
  }
}

.setting {
  height: 280px;
  padding: 10px;

  $currentOptionWidth: 70px;
  .currentOption {
    position: relative;
    width: $currentOptionWidth;
    height: $currentOptionWidth;
    border: 1px solid rgb(243, 69, 69);
    @include backgroundAdj($optionList-height);
    @include hover-effect();

    .closeBtn{
      position: absolute;
      top:0;
      right:0;
      color:red;
      font-size:50px;
      line-height:10px;
    }

  }

  .resize {
    input {
      width: 30px;
    }
  }

  .undoBtn,
  .resetBtn,
  .clearBtn {
    @include hover-effect();
  }
}

.template {
  height: 200px;

  div {
    padding-top: 5px;
    @include hover-effect();
  }
}

.cancelBtn {
  height: 20px;
  @include hover-effect();
}

.doneBtn {
  @extend .cancelBtn;
}
</style>

