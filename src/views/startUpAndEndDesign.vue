<template>
  <div id="startUpAndEndDesign">
    <!-- leftContainer -->
    <div class="leftContainer">
      <div class="operationalPanel" v-bind:style="backgroundStyle">
        <button
          class="startBtn"
          v-bind:style="startBtnStyle"
          v-on:mousedown="moveButton()"
          v-on:click="mode = 'startUpBtnEditing'"
        >{{startUpBtnText}}</button>
        <picture-component
          v-for="(item,index) in pictureComponents"
          v-bind:key="'pictureComponents'+index"
          v-bind="item"
          v-on:change-pictureFocus="changePictureFocus($event)"
        ></picture-component>
        <text-component
          v-for="(item,index) in textComponents"
          v-bind:key="'textComponents'+index"
          v-bind="item"
          v-on:change-textFocus="changeTextFocus($event)"
        ></text-component>
      </div>
      <div class="options">
        <button @click="addText()">添加文字</button>
        <button @click="addPicture()">添加图片</button>
        <button @click="mode = 'backgroundEditing'">修改背景</button>
        <button @click="done()">完成</button>
      </div>
    </div>

    <!-- rightConatiner -->
    <div class="rightConatiner">
      <div class="settingPanel">
        <!-- pictureSetting -->
        <div class="pictureSetting" v-show="mode == 'pictrureEditing'">
          <div class="filter">
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
            大小
            <input
              type="range"
              min="10"
              max="600"
              step="1"
              :value="pictureComponents[currentPictureFocus] == undefined?1:pictureComponents[currentPictureFocus].width"
              @input="changePictureProperty('width',1)"
            >
          </div>
          <div class="opacityAdj">
            透明度
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
            左
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
          <div class="stepUpOrDown">
            <button class="stepUp" value="1" @click="changePictureProperty('zIndex',0)">往上一层</button>
            <button class="stepDown" value="-1" @click="changePictureProperty('zIndex',0)">往下一层</button>
          </div>
          <div class="destroyBtn">
            <button @click="changePictureProperty('destroy',false)">删除</button>
          </div>
        </div>

        <!-- textSetting -->
        <div class="textSetting" v-show="mode == 'textEditing'">
          <div>
            <input
              type="color"
              :value="textComponents[currentTextFocus] == undefined?'#b900ff':textComponents[currentTextFocus].color"
              @input="changeTextProperty('color','blue')"
            >
          </div>
          <div class="resize">
            大小
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
            透明度
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
            左
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
          <div class="stepUpOrDown">
            <button class="stepUp" value="1" @click="changeTextProperty('zIndex',0)">往上一层</button>
            <button class="stepDown" value="-1" @click="changeTextProperty('zIndex',0)">往下一层</button>
          </div>
          <div class="destroyBtn">
            <button @click="changeTextProperty('destroy',false)">删除</button>
          </div>
        </div>

        <!-- backgroundEditing -->
        <div class="backgroundSetting" v-show="mode == 'backgroundEditing'">
          <div class="changeBackgroundColor">
            更换背景颜色：
            <input type="color" v-model="backgroundStyle.backgroundColor">
          </div>
          <div class="changeBackgroundImage">
            更换背景图片：
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
        <div class="startUpBtnSetting" v-show="mode == 'startUpBtnEditing'">
          <div class="startUpBtnText">
            <input type="text" v-model="startUpBtnText">
          </div>
          <div class="startUpBtnWidth">
            长
            <input
              type="range"
              min="10"
              max="200"
              step="1"
              :value="pixelTypeTransfer(startBtnStyle.width)"
              @input="startBtnStyle.width = pixelTypeTransfer(Number($event.target.value))"
            >
            <br>宽
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
          <div class="changeBtnColor">
            按钮颜色
            <input type="color" v-model="startBtnStyle.backgroundColor">
          </div>
          <div class="changeFontColor">
            字体颜色：
            <input type="color" v-model="startBtnStyle.color">
          </div>
          <div class="changeBorderColor">
            边框颜色：
            <input type="color" v-model="startBtnStyle.borderColor">
          </div>
          <div class="stepUpOrDown">
            <button class="stepUp" @click="startBtnStyle.zIndex+=1">往上一层</button>
            <button class="stepDown" @click="startBtnStyle.zIndex-=1">往下一层</button>
          </div>
        </div>
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
  name: "startUpAndEndDesign",
  mixins: [filterGroupMixin],
  created() {
    //注入数据
    this.startBtnStyle = JSON.parse(JSON.stringify(this.startUpBtnFromVuex))
    this.pictureComponents = JSON.parse(JSON.stringify(this.pictureComponentsFormVuex))
    this.textComponents = JSON.parse(JSON.stringify(this.textComponentsFormVuex));
    this.backgroundStyle = JSON.parse(JSON.stringify(this.backgroundStyleFromVuex));
    this.startUpBtnText = this.startUpBtnTextFromVuex;
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
      startUpBtnText: ""
    };
  },
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
        this.mode == "pictrureEditing" ? this.currentPictureFocus : -1;
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
    })
  },
  methods: {
    ...mapMutations("startUpFace", {
      uploadDataToVuex: "changeData",
      restart:"restart"
    }),
    done() {
      //上传数据
      this.restart();
      this.uploadDataToVuex({
        startUpBtn: this.startBtnStyle,
        backgroundStyle: this.backgroundStyle,
        startUpBtnText: this.startUpBtnText
      });
      this.$router.push("/entireGame");
    },
    pixelTypeTransfer(value) {
      if (typeof value == "string") {
        return Number(value.match(/-?\d+/)[0]);
      } else {
        return value + "px";
      }
    },
    moveButton() {
      let self = this;
      event.target.addEventListener("mousemove", move);
      let startX = event.clientX;
      let startY = event.clientY;
      let startLeft = self.pixelTypeTransfer(self.startBtnStyle.left);
      let startTop = self.pixelTypeTransfer(self.startBtnStyle.top);

      function move(event) {
        if (event.buttons == 0) {
          event.target.removeEventListener("mousemove", move);
          return;
        }
        let xDiff = event.clientX - startX;
        let yDiff = event.clientY - startY;
        self.startBtnStyle.left = self.pixelTypeTransfer(startLeft + xDiff);
        self.startBtnStyle.top = self.pixelTypeTransfer(startTop + yDiff);
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
      if (this.mode == "pictrureEditing") return;
      this.mode = "pictrureEditing";
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
      } else if (property == "destroy") {
        value = true;
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
      } else if (property == "destroy") {
        value = true;
      }
      this.pictureComponents[this.currentPictureFocus][property] = value;
    },
    addText() {
      this.textComponents.push({
        index: this.textComponents.length,
        currentFocus: this.textComponents.length,
        fontSize: 20,
        color: "#b900ff",
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
            this.mode = "pictrureEditing";
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
#startUpAndEndDesign {
  text-align: center;
}

.leftContainer {
  display: inline-block;
}
.rightConatiner {
  display: inline-block;
  vertical-align: top;
}

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
}

.settingPanel {
  width: 200px;
  height: 400px;
  border: 1px solid lightblue;
}

.good {
  position: absolute;
  color: red;
  background: rgb(0, 0, 0, 0);
  font-size: 30px;
  border: none;
}
</style>