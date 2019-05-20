<template>
  <div id="faceComponent">
    <!-- leftContainer -->
    <div class="leftContainer">
      <div class="operationalPanel" v-bind:style="backgroundStyle">
        <button
          class="startBtn"
          v-if="face=='start'"
          v-bind:style="startBtnStyle"
          v-on:mousedown="moveDOM(startBtnStyle)"
          v-on:click="mode = 'startUpBtnEditing'"
        >{{startUpBtnText}}</button>
        <pre
          class="textFlow"
          v-if="face=='end'"
          v-on:mousedown="moveDOM(textFlowStyle)"
          v-bind:style="textFlowStyle"
          v-on:click="mode = 'textFlowEditing'"
        >{{textFlowText}}</pre>
        <picture-component
          v-for="(item,index) in pictureComponents"
          v-bind:key="'pictureComponents'+index"
          v-bind="item"
          v-bind:face="face"
          v-on:change-pictureFocus="changePictureFocus($event)"
        ></picture-component>
        <text-component
          v-for="(item,index) in textComponents"
          v-bind:key="'textComponents'+index"
          v-bind="item"
          v-bind:face="face"
          v-on:change-textFocus="changeTextFocus($event)"
        ></text-component>
      </div>
    </div>

    <!-- rightConatiner -->
    <div class="rightConatiner">
      <div class="settingPanel">
        <!-- options group -->
        <div class="options">
          <div @click="addText()">添加文字</div>
          <div @click="addPicture()">添加图片</div>
          <div @click="mode = 'backgroundEditing'">修改背景</div>
        </div>

        <h3 class="modeTitle">{{modeTitle}}</h3>
        <div class="seperateline">
          <hr>
        </div>

        <!-- pictureSetting -->
        <div class="pictureSetting" v-show="mode == 'pictureEditing'">
          <div class="leftContent">
            <div class="filter">
              <span>效果</span>
              <select
                :value="pictureComponents[currentPictureFocus] == undefined?'default':pictureComponents[currentPictureFocus].filter"
                @change="changePictureProperty('filter','none')"
              >
                <option disabled value="default">滤镜</option>
                <option
                  v-for="(effect,index) in filterGroup"
                  :key="'filterGroup'+index"
                  :value="effect.value"
                >{{effect.name}}</option>
              </select>
            </div>

            <div class="resize">
              <span>大小</span>
              <input
                type="range"
                min="10"
                max="600"
                step="1"
                :value="pictureComponents[currentPictureFocus] == undefined?1:pictureComponents[currentPictureFocus].width"
                @input="changePictureProperty('width',1)"
              >
            </div>
          </div>
          <div class="middleContent">
            <div class="opacityAdj">
              <span>透明度</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="pictureComponents[currentPictureFocus] == undefined?0:pictureComponents[currentPictureFocus].opacity"
                @input="changePictureProperty('opacity',1)"
              >
            </div>

            <div class="rotateBtn">
              <span>左</span>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                :value="pictureComponents[currentPictureFocus] == undefined?-180:pictureComponents[currentPictureFocus].rotate"
                @input="changePictureProperty('rotate',100)"
              >
              右
            </div>
          </div>
          <div class="rightContent">
            <div class="stepUpOrDown">
              <button class="stepUp" value="1" @click="changePictureProperty('zIndex',0)">往上一层</button>
              <button class="stepDown" value="-1" @click="changePictureProperty('zIndex',0)">往下一层</button>
            </div>
            <div class="destroyBtn">
              <button @click="changePictureProperty('destroy',false)">删除</button>
            </div>
          </div>
        </div>

        <!-- textSetting -->
        <div class="textSetting" v-show="mode == 'textEditing'">
          <div class="leftContent">
            <div class="resize">
              <span>大小</span>
              <input
                type="range"
                min="5"
                max="200"
                step="1"
                :value="textComponents[currentTextFocus] == undefined?5:textComponents[currentTextFocus].fontSize"
                @input="changeTextProperty('fontSize',1)"
              >
            </div>
            <div class="opacityAdj">
              <span>透明度</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="textComponents[currentTextFocus] == undefined?0:textComponents[currentTextFocus].opacity"
                @input="changeTextProperty('opacity',1)"
              >
            </div>
            <div class="rotateBtn">
              <span>左</span>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                :value="textComponents[currentTextFocus] == undefined?-180:textComponents[currentTextFocus].rotate"
                @input="changeTextProperty('rotate',100)"
              >
              右
            </div>
          </div>
          <div class="rightContent">
            <div class="colorInput">
              <span>颜色</span>
              <input
                type="color"
                :value="textComponents[currentTextFocus] == undefined?'#b900ff':textComponents[currentTextFocus].color"
                @input="changeTextProperty('color','blue')"
              >
            </div>
            <div class="stepUpOrDown">
              <button class="stepUp" value="1" @click="changeTextProperty('zIndex',0)">往上一层</button>
              <button class="stepDown" value="-1" @click="changeTextProperty('zIndex',0)">往下一层</button>
            </div>
            <div class="destroyBtn">
              <button @click="changeTextProperty('destroy',false)">删除</button>
            </div>
          </div>
        </div>

        <!-- backgroundEditing -->
        <div class="backgroundSetting" v-show="mode == 'backgroundEditing'">
          <div class="changeBackgroundColor">
            背景颜色：
            <input type="color" v-model="backgroundStyle.backgroundColor">
          </div>
          <div class="changeBackgroundImage">
            背景图片：
            <button @click="addPicture(true)">导入背景</button>
          </div>
          <div class="backgroundOption">
            背景位置：
            <select @change="changeBackgroundSize($event.target.value)">
              <option value="700px 400px">填满</option>
              <option value="cover">覆盖</option>
              <option value="contain">包含</option>
              <option value="repeat">重复</option>
            </select>
          </div>
        </div>

        <!-- startUpBtn -->
        <div class="startUpBtnSetting" v-show="mode == 'startUpBtnEditing'" v-if="face=='start'">
          <div class="startUpBtnText">
            <input type="text" v-model="startUpBtnText">
          </div>
          <div class="leftContent">
            <div class="startUpBtnWidth">
              长度
              <input
                type="range"
                min="10"
                max="200"
                step="1"
                :value="pixelTypeTransfer(startBtnStyle.width)"
                @input="startBtnStyle.width = pixelTypeTransfer(Number($event.target.value))"
              >
              <br>宽度
              <input
                type="range"
                min="10"
                max="200"
                step="1"
                :value="pixelTypeTransfer(startBtnStyle.height)"
                @input="startBtnStyle.height = pixelTypeTransfer(Number($event.target.value))"
              >
            </div>
            <div class="startUpBtnBorderRadius">
              边角
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                :value="pixelTypeTransfer(startBtnStyle.borderRadius)"
                @input="startBtnStyle.borderRadius = pixelTypeTransfer(Number($event.target.value))"
              >
            </div>
          </div>
          <div class="middleContent">
            <div class="startUpBtnBorderWidth">
              边框
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                :value="pixelTypeTransfer(startBtnStyle.borderWidth)"
                @input="startBtnStyle.borderWidth = pixelTypeTransfer(Number($event.target.value))"
              >
            </div>
            <div class="startUpBtnFontSize">
              字体
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                :value="pixelTypeTransfer(startBtnStyle.fontSize)"
                @input="startBtnStyle.fontSize = pixelTypeTransfer(Number($event.target.value))"
              >
            </div>
          </div>
          <div class="rightContent">
            <div class="changeBtnColor">
              按钮颜色：
              &nbsp;
              <input type="color" v-model="startBtnStyle.backgroundColor">
            </div>
            <div class="changeFontColor">
              字体颜色：
              &nbsp;
              <input type="color" v-model="startBtnStyle.color">
            </div>
            <div class="changeBorderColor">
              边框颜色：
              &nbsp;
              <input type="color" v-model="startBtnStyle.borderColor">
            </div>
          </div>

          <div class="stepUpOrDown">
            <button class="stepUp" @click="startBtnStyle.zIndex+=1">往上一层</button>
            <button
              class="stepDown"
              @click="startBtnStyle.zIndex == startBtnStyle==0?0:startBtnStyle - 1"
            >往下一层</button>
          </div>
        </div>

        <!-- text-flow -->
        <div class="textFlowSetting" v-if="face=='end'" v-show="mode=='textFlowEditing'">
          <div class="leftContent">
            <textarea v-model="textFlowText"></textarea>
            <div class="textFlowFontSize">
              <span>字体</span>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                :value="pixelTypeTransfer(textFlowStyle.fontSize)"
                @input="textFlowStyle.fontSize = pixelTypeTransfer(Number($event.target.value))"
              >
            </div>
            <div class="changeFontColor">
              <span>字体颜色</span>
              <input type="color" v-model="textFlowStyle.color">
            </div>
          </div>
          <div class="rightContent">
            <label>
              ----
              <input type="checkbox" v-model="textFlowStyle.animation">动画
              ----
            </label>
            <div v-if="textFlowStyle.animation">
              <span>持续时间</span>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                v-model.number="textFlowStyle.animationTime"
              >
              {{textFlowStyle.animationTime}}秒
              <br>
              <span>移动距离</span>
              <input
                type="range"
                min="0"
                max="2000"
                step="1"
                v-model.number="textFlowStyle.animationDistance"
              >
              {{textFlowStyle.animationDistance}}
              <br>
              <span>移动方向</span>
              <select v-model.number="textFlowStyle.animationDir">
                <option value="top">上</option>
                <option value="left">左</option>
                <option value="right">右</option>
                <option value="bottom">下</option>
              </select>
              <br>
              <button @click="textFlowAnimate()" v-bind:disabled="runningAnimation">测试</button>
              <button @click="runningAnimation = false">停止</button>
            </div>
          </div>
        </div>

        <!-- done -->
        <button @click="done()" class="doneBtn">完成</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import pictureComponent from "@/components/startUpAndEnd/pictureComponent";
import textComponent from "@/components/startUpAndEnd/textComponent";
import filterGroupMixin from "@/components/startUpAndEnd/filterGroup";
import { mapState, mapMutations } from "vuex";

export default {
  name: "faceComponent",
  mixins: [filterGroupMixin],
  created() {
    //注入数据
    //两个版本
    if (this.face == "start") {
      this.startBtnStyle = JSON.parse(JSON.stringify(this.startUpBtnFromVuex));
      this.pictureComponents = JSON.parse(
        JSON.stringify(this.pictureComponentsFormVuex)
      );
      this.textComponents = JSON.parse(
        JSON.stringify(this.textComponentsFormVuex)
      );
      this.backgroundStyle = JSON.parse(
        JSON.stringify(this.backgroundStyleFromVuex)
      );
      this.startUpBtnText = this.startUpBtnTextFromVuex;
    } else if (this.face == "end") {
      this.pictureComponents = JSON.parse(
        JSON.stringify(this.endPictureComponentsFromVuex)
      );
      this.textComponents = JSON.parse(
        JSON.stringify(this.endTextComponentsFromVuex)
      );
      this.backgroundStyle = JSON.parse(
        JSON.stringify(this.endBackgroundStyleFromVuex)
      );
      this.textFlowStyle = JSON.parse(
        JSON.stringify(this.textFlowStyleFromVuex)
      );
      this.textFlowText = JSON.parse(JSON.stringify(this.textFlowTextFromVuex));
    }
  },
  beforeDestroy() {
    //上传数据
    //两个版本
    if (this.runningAnimation == true) {
      this.runningAnimation = false;
      this.textFlowStyle.top = this.startPosTop;
      this.textFlowStyle.left = this.startPosLeft;
    }
    if (this.face == "start") {
      //开头
      this.restart();
      this.uploadDataToVuex({
        startUpBtn: this.startBtnStyle,
        backgroundStyle: this.backgroundStyle,
        startUpBtnText: this.startUpBtnText
      });
    } else if (this.face == "end") {
      //结尾
      this.endRestart();
      this.endUploadDataToVuex({
        backgroundStyle: this.backgroundStyle,
        textFlowStyle: JSON.parse(JSON.stringify(this.textFlowStyle)),
        textFlowText: this.textFlowText
      });
    }
  },
  components: {
    pictureComponent,
    textComponent
  },
  data: function() {
    return {
      pictureComponents: [],
      textComponents: [],
      currentPictureFocus: -1,
      currentTextFocus: -1,
      mode: "none",
      backgroundStyle: null,
      startBtnStyle: null,
      startUpBtnText: "",
      textFlowStyle: null,
      textFlowText: "",
      //查看是否正在运行animation
      runningAnimation: false,
      startPosLeft: "0px",
      startPosTop: "0px"
    };
  },
  props: ["face"],
  watch: {
    currentPictureFocus() {
      this.pictureComponents.forEach(
        components => (components.currentFocus = this.currentPictureFocus)
      );
    },
    currentTextFocus() {
      this.textComponents.forEach(
        components => (components.currentFocus = this.currentTextFocus)
      );
    },
    mode() {
      this.currentPictureFocus =
        this.mode == "pictureEditing" ? this.currentPictureFocus : -1;
      this.currentTextFocus =
        this.mode == "textEditing" ? this.currentTextFocus : -1;
    }
  },
  computed: {
    //注入数据
    ...mapState("startUpFace", {
      startUpBtnFromVuex: "startUpBtn",
      pictureComponentsFormVuex: "pictureComponents",
      textComponentsFormVuex: "textComponents",
      backgroundStyleFromVuex: "backgroundStyle",
      startUpBtnTextFromVuex: "startUpBtnText"
    }),
    ...mapState("endFace", {
      endPictureComponentsFromVuex: "pictureComponents",
      endTextComponentsFromVuex: "textComponents",
      endBackgroundStyleFromVuex: "backgroundStyle",
      textFlowStyleFromVuex: "textFlowStyle",
      textFlowTextFromVuex: "textFlowText"
    }),
    modeTitle() {
      if (this.mode == "pictureEditing") {
        return "图片编辑";
      } else if (this.mode == "textEditing") {
        return "文字编辑";
      } else if (this.mode == "backgroundEditing") {
        return "背景编辑";
      } else if (this.mode == "textFlowEditing") {
        return "文字动画编辑";
      } else if (this.mode == "startUpBtnEditing") {
        return "开始按钮编辑";
      } else {
        return "点击相应元素进行编辑";
      }
    }
  },
  methods: {
    ...mapMutations("startUpFace", {
      uploadDataToVuex: "changeData",
      restart: "restart"
    }),
    ...mapMutations("endFace", {
      endUploadDataToVuex: "changeData",
      endRestart: "restart"
    }),
    done() {
      this.$router.push("/entireGame");
    },
    //pixelString 和 number 的转换
    pixelTypeTransfer(value) {
      if (typeof value == "string") {
        return Number(value.match(/-?\d+/)[0]);
      } else {
        return value + "px";
      }
    },
    //textFlow的动画
    textFlowAnimate() {
      let time = this.textFlowStyle.animationTime * 1000;
      let distance = this.textFlowStyle.animationDistance;
      if (time == 0 || distance == 0) return;
      //存储初始位置
      let startTop = this.textFlowStyle.top;
      let startLeft = this.textFlowStyle.left;
      this.startPosTop = startTop;
      this.startPosLeft = startLeft;
      this.runningAnimation = true;
      let dir = this.textFlowStyle.animationDir;
      let start = 1;
      if (dir == "top" || dir == "bottom") {
        distance = dir == "top" ? -1 * distance : 1 * distance;

        let animate = setInterval(() => {
          this.textFlowStyle.top =
            this.pixelTypeTransfer(this.textFlowStyle.top) +
            (distance / time) * 60 +
            "px";
          start += 60;
          if (start > time || this.runningAnimation == false) {
            clearInterval(animate);
            this.runningAnimation = false;
            this.textFlowStyle.top = startTop;
            this.textFlowStyle.left = startLeft;
          }
        }, 60);
      } else {
        distance = dir == "left" ? -1 * distance : distance;
        let animate = setInterval(() => {
          this.textFlowStyle.left =
            this.pixelTypeTransfer(this.textFlowStyle.left) +
            (distance / time) * 60 +
            "px";
          start += 60;
          if (start > time || this.runningAnimation == false) {
            clearInterval(animate);
            this.runningAnimation = false;
            this.textFlowStyle.top = startTop;
            this.textFlowStyle.left = startLeft;
          }
        }, 60);
      }
    },
    //移动DOM -》 textFlow与startUpBtn
    moveDOM(dom) {
      let self = this;
      event.target.addEventListener("mousemove", move);
      let startX = event.clientX;
      let startY = event.clientY;
      let startLeft = self.pixelTypeTransfer(dom.left);
      let startTop = self.pixelTypeTransfer(dom.top);

      function move(event) {
        if (event.buttons == 0) {
          event.target.removeEventListener("mousemove", move);
          return;
        }
        let xDiff = event.clientX - startX;
        let yDiff = event.clientY - startY;
        dom.left = self.pixelTypeTransfer(startLeft + xDiff);
        dom.top = self.pixelTypeTransfer(startTop + yDiff);
      }
    },
    changeBackgroundSize(value) {
      if (value != "repeat") {
        this.backgroundStyle.backgroundSize = value;
        this.backgroundStyle.backgroundRepeat = "no-repeat";
      } else {
        this.backgroundStyle.backgroundSize = "auto";
        this.backgroundStyle.backgroundRepeat = "repeat";
      }
    },
    changeTextFocus(index) {
      this.currentTextFocus = index;
      if (this.mode == "textEditing") return;
      this.mode = "textEditing";
    },
    changePictureFocus(index) {
      this.currentPictureFocus = index;
      if (this.mode == "pictrueEditing") return;
      this.mode = "pictureEditing";
    },
    changeTextProperty(property, defaultValue) {
      if (this.textComponents[this.currentTextFocus] == undefined)
        return defaultValue;
      let value = event.target.value;
      if (
        property == "fontSize" ||
        property == "opacity" ||
        property == "rotate"
      ) {
        value = Number(value);
      } else if (property == "zIndex") {
        value =
          this.textComponents[this.currentTextFocus][property] + Number(value);
        if (value == -1) return;
      } else if (property == "destroy") {
        value = true;
        this.mode = "none";
      }
      this.textComponents[this.currentTextFocus][property] = value;
    },
    changePictureProperty(property, defaultValue) {
      if (this.pictureComponents[this.currentPictureFocus] == undefined)
        return defaultValue;
      let value = event.target.value;
      if (
        property == "opacity" ||
        property == "width" ||
        property == "rotate"
      ) {
        value = Number(value);
      } else if (property == "zIndex") {
        value =
          this.pictureComponents[this.currentPictureFocus][property] +
          Number(value);
        if (value == -1) return;
      } else if (property == "destroy") {
        value = true;
        this.mode = "none";
      }
      this.pictureComponents[this.currentPictureFocus][property] = value;
    },
    addText() {
      this.textComponents.push({
        index: this.textComponents.length,
        currentFocus: this.textComponents.length,
        fontSize: 20,
        color: "#00a9ff",
        rotate: 0,
        zIndex: 0,
        opacity: 1,
        destroy: false
      }),
        (this.currentTextFocus = this.textComponents.length - 1);
      this.mode = "textEditing";
    },
    addPicture(isBackground) {
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.addEventListener("change", event => {
        if (input.files[0] == null) return;
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          if (isBackground === true) {
            this.backgroundStyle.backgroundImage = `url(${reader.result})`;
          } else {
            this.pictureComponents.push({
              url: reader.result,
              width: 100,
              filter: "none",
              index: this.pictureComponents.length,
              currentFocus: this.pictureComponents.length,
              opacity: 1,
              rotate: 0,
              zIndex: 0,
              destroy: false
            });
            this.currentPictureFocus = this.pictureComponents.length - 1;
            this.mode = "pictureEditing";
          }
        });
        reader.readAsDataURL(input.files[0]);
      });
      input.click();
      input.remove();
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../lib/_consistentStyle";

#faceComponent {
  text-align: center;
  width: 900px;
  margin: auto;
}

.leftContainer {
  display: inline-block;
}

.rightConatiner {
  display: inline-block;
  vertical-align: top;
}

//操作台
.operationalPanel {
  position: relative;
  width: 700px;
  height: 400px;
  overflow: hidden;
  background-position: center;

  .startBtn {
    position: absolute;
    &:hover {
      cursor: pointer;
    }
  }
  .textFlow {
    @extend .startBtn;
  }
}

//设置版
.settingPanel {
  position: relative;
  width: 200px;
  height: 400px;
  border: 1px solid lightblue;

  .stepUpOrDown,
  .destroyBtn {
    button {
      margin-top: 5px;
      margin-right: 10px;
    }
  }

  .seperateline {
    width: 100px;
    margin: 20px auto;
  }

  .options {
    width: 100%;
    div {
      display: inline-block;
      vertical-align: top;
      width: 33.3%;
      background-color: #d7d5d5;
      border: 1px solid lightblue;
      font-size: 12px;
      &:hover {
        background-color: red;
        color: white;
        cursor: pointer;
      }
    }
  }

  .startUpBtnSetting {
    .startUpBtnText {
      padding-bottom: 5px;
      text-align: center;
      padding-left: 0px;
      input {
        width: 100px;
      }
    }
    div {
      text-align: left;
      padding-left: 10px;
      input[type="range"] {
        width: 100px;
      }
    }
    .stepUpOrDown {
      padding-left: 20px;
    }
    .changeBtnColor {
      margin-top: 5px;
    }
  }

  .textSetting {
    div {
      text-align: left;
      padding-left: 10px;
      span {
        text-align: right;
        display: inline-block;
        min-width: 50px;
      }
      input {
        display: inline-block;
        max-width: 70px;
        margin: 5px;
      }
    }
  }

  .pictureSetting {
    @extend .textSetting;
    select {
      display: inline-block;
      max-width: 70px;
      margin: 5px;
      vertical-align: bottom;
    }
  }

  .backgroundSetting {
    text-align: left;
    padding-left: 10px;
    div {
      margin-bottom: 10px;
    }
  }

  .textFlowSetting {
    padding: 0px 10px;
    text-align: left;
    textarea {
      display: block;
      resize: none;
      width: 100%;
      height: 70px;
      margin-bottom: 10px;
    }
    div {
      margin-bottom: 5px;
      span {
        max-width: 65px;
      }
      input {
        max-width: 70px;
      }
    }
    button {
      margin-right: 5px;
    }
    label {
      display: block;
      text-align: center;
    }
  }

  .doneBtn {
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30px;
    background-color: #d7d5d5;
    border: 1px solid lightblue;
    font-size: 12px;
    &:hover {
      background-color: red;
      color: white;
      cursor: pointer;
    }
  }
}

@media screen and (max-width: 920px) {

  .leftContainer {
    display: block;
    .operationalPanel {
      margin: auto;
    }
  }
  .rightConatiner {
    display: block;
    .settingPanel {
      margin: auto;
      width: 700px;
      height: 240px;

      .options {
        div {
          font-size: 15px;
        }
      }

      .modeTitle{
        margin-top:15px;
        margin-bottom:0;
      }
      .seperateline {
        width: 300px;
        margin:5px auto
      }

      .backgroundSetting {
        div {
          padding-top:20px;
          width: 33.3%;
          display: inline-block;
          text-align: center;
        }
      }

      .startUpBtnSetting {
        position: relative;
        .leftContent,
        .middleContent,
        .rightContent,
        .stepUpOrDown {
          display: inline-block;
          width: 33.3%;
          div {
            text-align: center;
          }
        }
        .stepUpOrDown {
          text-align: center;
          position: absolute;
          left: 50%;
          top: 30%;
          transform: translateX(-50%);
          padding-left: 25px;
        }
      }

      .textSetting {
        position: relative;
        .leftContent,
        .rightContent {
          padding-top:20px;
          display: inline-block;
          width: 50%;
        }
        .leftContent {
          padding-left: 120px;
          input[type="range"] {
            max-width: 100px;
          }
        }
        .rightContent {
          input[type="color"] {
            margin-top: 0;
            margin-bottom: 0;
          }
        }
      }

      .textFlowSetting {
        .leftContent,
        .rightContent {
          display: inline-block;
          width: 50%;
          vertical-align: top;
        }
        .leftContent {
          padding-left: 70px;
          textarea {
            width: 85%;
            margin: 0px;
          }
        }
        .rightContent {
          div {
            margin-top: 5px;
            padding-left: 50px;
            input[type="range"] {
              max-width: 120px;
            }
          }
        }
      }

      .pictureSetting {
        .leftContent,
        .middleContent,
        .rightContent {
          display: inline-block;
          width: 33.3%;
          padding-left: 30px;
        }
      }
    }
  }
}
</style>