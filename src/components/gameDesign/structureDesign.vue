<template>
  <div id="structureDesign">
    <div class="leftContainer">
      <div class="panel">
        <table class="map" @mousedown.prevent.stop="mutateGrids($event)">
          <tr v-for="(_,rowIndex) in map" :key="'row'+rowIndex">
            <td
              v-for="(_,gridIndex) in map[0]"
              class="grid"
              :key="'row'+rowIndex+'-'+'grid'+gridIndex"
              :name="rowIndex+'-'+gridIndex"
              :style="{backgroundImage:map[rowIndex][gridIndex].backgroundImage}"
            ></td>
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
            v-for="(option,index) in optionsForSelctor[selectedSelector]"
            :key="selectedSelector+index"
            :style="{backgroundImage:'url('+option.src+')'}"
            @click="selectedOption = option"
          ></div>
        </div>
      </div>
    </div>
    <div class="rightContainer">
      <div class="setting"></div>
      <div class="template"></div>
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
    let level =
      this.initalLevel == null ? defaultGameLevel[0] : this.initalLevel;
    let map = stringToMap(level, pics);

    this.map = map;
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
      optionsForSelctor: {
        walls: [this.createOption("wallIcon", "#")],
        players: [this.createOption("playerIcon", "@")],
        monsters: [],
        collectors: [this.createOption("coinIcon", "o")],
        lava: [
          this.createOption("lavaIcon", "+"),
          this.createOption("lavaIcon", "="),
          this.createOption("lavaIcon", "|"),
          this.createOption("lavaIcon", "v")
        ]
      }
    };
  },
  computed: {
    initalLevel() {
      //开始使用，最后应该通过store注入
      return null;
    }
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
      startMutate(event);
      let map = document.getElementsByClassName("map")[0];
      map.addEventListener("mousemove", startMutate);
      function startMutate(event) {
        if (event.buttons == 0) {
          map.removeEventListener("mousemove", startMutate);
        } else {
          let index = event.target.getAttribute("name");
          let [_, y, x] = index.match(/(\d+)-(\d+)/);
          self.mutateGrid(y, x);
        }
      }
    },
    mutateGrid(y, x) {
      let { src, pattern } = this.selectedOption;
      let targetGrid = this.map[y][x];
      if (pattern == targetGrid.pattern) return;
      targetGrid.backgroundImage = `url(${src})`;
      targetGrid.pattern = pattern;
    }
  }
};
</script>

<style scoped lang='scss'>
$left-flex: 75%;
$optionList-height: 40px;

%flex-item-children {
  border: 1px solid lightblue;
}

%backgroundAdj {
  background-position: center;
  background-repeat: no-repeat;
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
    border: 0.5px solid lightblue;
    background-color: rgb(52, 166, 251);
    @extend %backgroundAdj;
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
      @extend %backgroundAdj;
      @include hover-effect();
    }
  }
}

.setting {
  height: 280px;
}

.template {
  height: 200px;
}

.cancelBtn {
  height: 20px;
  @include hover-effect();
}

.doneBtn {
  @extend .cancelBtn;
}
</style>

