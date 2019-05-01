<template>
  <div id="pictureCombine">
    <!-- canvasContainer -->
    <div
      class="canvasContainer"
      @mousedown="moveCanvas($event)"
      :style="{width:canvasContainerSize.width+'px',height:canvasContainerSize.height+'px'}"
    >
      <canvas
        class="toCombineCanvas"
        :width="canvasContainerSize.width"
        :height="canvasContainerSize.height"
        :update="imgContentPos.top + imgContentPos.left + rotate + flip"
      ></canvas>
      <div
        class="previewContainer"
        :style="{width:previewSize.width+'px',height:previewSize.height+'px'}"
      >
        <canvas class="previewCanvas" :width="previewSize.width" :height="previewSize.height"></canvas>
      </div>
    </div>

    <!-- resize -->
    <div class="resize">
      <input type="range" min="0.5" max="3" step="0.05" v-model.number="scale">
    </div>

    <!-- back and go  -->
    <div class="goback" @click="goBack()">返回</div>
    <div class="done" @click="generatePlayerFigure()">下一步</div>

    <!-- options -->
    <div class="adjustOptions">
      <span class="leftRotate" @click="rotate-=5">
        <font-awesome-icon icon="undo" class="fa-lg"/>
      </span>
      <div class="flip" @click="flip = !flip">&#8596;</div>
      <span class="rightRotate" @click="rotate+=5">&#8635;</span>
    </div>

    <!-- <img class='testImg'> -->
  </div>
</template>

<script>
import { headLessBodyGroupImg } from "./lib/imgSource.js";

export default {
  name: "PictureCombine",

  created: function() {
    //如果没有图片数据，就返回编辑页
    if (this.inputCanvasSize.width == null) {
      this.$router.push({ path: "/playerFigure" });
    }
  },
  mounted: function() {
    //起始的时候把图片放上去
    if (this.inputCanvasSize.width == null) return;
    this.toCombineCanvasContext.putImageData(this.inputCanvasData, 0, 0);
  },
  updated: function() {
    //清除canvas
    this.toCombineCanvasContext.clearRect(
      0,
      0,
      this.canvasContainerSize.width,
      this.canvasContainerSize.height
    );
    this.previewCanvasContext.clearRect(
      0,
      0,
      this.previewSize.width,
      this.previewSize.height
    );

    //开始画
    //使用drawImage来画
    //不使用putImageData是因为putImageData不接受transform的作用。
    //toCombinedCanvas
    this.drawCanvasAfterTransform(
      this.inputCanvasImg,
      this.toCombineCanvasContext,
      this.imgContentPos.left,
      this.imgContentPos.top,
      this.inputCanvasSize.width, //需要调整
      this.inputCanvasSize.height
    );
    this.drawCanvasAfterTransform(
      this.inputCanvasImg,
      this.previewCanvasContext,
      this.imgContentPos.left * this.ratio,
      this.imgContentPos.top * this.ratio,
      this.inputCanvasSize.width * this.ratio,
      this.inputCanvasSize.height * this.ratio
    );
  },
  data: function() {
    return {
      scale: 1,
      rotate: 0,
      flip: false,
      imgContentPos: {
        top: 0,
        left: 0
      },
      previewSize: {
        width: 48,
        height: 60
      },
      canvasContainerSize: {
        width: 320,
        height: 400
      }
    };
  },
  computed: {
    //获取store的数据
    inputCanvasData: function() {
      return this.$store.state.playerFigure.imgData;
    },
    inputCanvasSize: function() {
      return {
        width: this.$store.state.playerFigure.width,
        height: this.$store.state.playerFigure.height
      };
    },
    inputCanvasImg: function() {
      if (this.inputCanvasData == null) return null;
      let canvas = document.createElement("canvas");
      canvas.width = this.inputCanvasSize.width;
      canvas.height = this.inputCanvasSize.height;
      let context = canvas.getContext("2d");
      context.putImageData(this.inputCanvasData, 0, 0);
      let img = new Image();
      img.src = canvas.toDataURL();
      return img;
    },
    //获得视图信息
    toCombineCanvasDOM: function() {
      let canvas = document.getElementsByClassName("toCombineCanvas");
      return canvas[0];
    },
    toCombineCanvasContext: function() {
      return this.toCombineCanvasDOM.getContext("2d");
    },
    canvasContainerDOM: function() {
      let canvas = document.getElementsByClassName("canvasContainer");
      return canvas[0];
    },
    previewCanvasDOM: function() {
      let canvas = document.getElementsByClassName("previewCanvas");
      return canvas[0];
    },
    previewCanvasContext: function() {
      return this.previewCanvasDOM.getContext("2d");
    },
    //大小canvas的比例
    ratio: function() {
      return this.previewSize.width / this.canvasContainerSize.width;
    }
  },
  methods: {
    //返回
    goBack() {
      this.$router.push({ path: "/playerFigure" });
    },
    //移动canvas
    moveCanvas: function(event) {
      let self = this;
      let { widthDiff, heightDiff } = this.mouseImgPosDiff(event);
      self.canvasContainerDOM.addEventListener("mousemove", startMove);
      let scheduled = null;
      function startMove(event) {
        if (!scheduled) {
          setTimeout(() => {
            if (event.buttons == 0) {
              self.canvasContainerDOM.removeEventListener(
                "mousemove",
                startMove
              );
            }
            self.imgContentPos.left = event.clientX - widthDiff;
            self.imgContentPos.top = event.clientY - heightDiff;
            scheduled = null;
          }, 60);
        }
        scheduled = event;
      }
    },
    //位置信息
    mouseImgPosDiff: function(originalEvent) {
      return {
        widthDiff: originalEvent.clientX - this.imgContentPos.left,
        heightDiff: originalEvent.clientY - this.imgContentPos.top
      };
    },
    drawCanvasAfterTransform(img, context, left, top, width, height) {
      context.translate(left, top);
      if (this.flip == true) {
        flipScale(context, width / 2, this.scale);
      } else {
        context.scale(this.scale, this.scale);
      }
      context.rotate((this.rotate * Math.PI) / 180);
      context.drawImage(img, 0, 0, width, height);
      context.resetTransform();
      function flipScale(context, around, scale) {
        context.translate(around, 0);
        context.scale(-scale, scale);
        context.translate(-around, 0);
      }
    },
    //生成图像
    generatePlayerFigure() {
      let testCanvas = document.createElement("canvas");
      //根据实际大小调整
      testCanvas.width = 480;
      testCanvas.height = 600;
      let testCanvasCx = testCanvas.getContext("2d");
      let topAdjusteds = [2, -2, -3, -4, 2, -2, -3, -3, 0, -3];
      testCanvasCx.drawImage(headLessBodyGroupImg, 0, 0);
      for (let i = 0; i < 10; i++) {
        this.drawCanvasAfterTransform(
          this.inputCanvasImg,
          testCanvasCx,
          this.imgContentPos.left * this.ratio + 48 * i,
          this.imgContentPos.top * this.ratio + topAdjusteds[i],
          this.inputCanvasSize.width * this.ratio,
          this.inputCanvasSize.height * this.ratio
        );
      }
      // 用来测试
      // let img = document.querySelector('.testImg');
      // img.src = testCanvas.toDataURL()
      this.$store.commit("gameLevel/changeGlobalPlayerSetting", {
        playerSprites: testCanvas.toDataURL()
      });
      this.$router.push("/entireGame");
    }
  }
};
</script>

<style scoped lang='scss'>
%hover-effect {
  cursor: pointer;
  opacity: 0.8;
}
%background {
  background-image: url("../../pic/playerFigure/oneBody.png");
  background-repeat: no-repeat;
  background-size: cover;
}

#pictureCombine {
  position: relative;
  width: 320px;
  margin: auto;
  overflow: hidden;
}

.canvasContainer {
  border: 0.5px solid lightblue;
  position: relative;
  background-color: #fcfcfc;
  @extend %background;

  .toCombineCanvas {
    position: absolute;
    top: 0;
    left: 0;
  }

  .previewContainer {
    position: absolute;
    right: 0;
    bottom: 0;
    border: 1px solid lightblue;
    @extend %background;
  }
}

.resize{
  display: inline;
  position: absolute;
  bottom:0;
  left:50%;
  transform: translateX(-50%)
}

.goback {
  display: inline;
  position: absolute;
  left: -35px;
  top: 0;
  border: 1px solid lightblue;
  padding: 0 5px;
  border-bottom-right-radius: 5px;
  background-color: #d2caca;
  color: #992424;
  transition: all 0.3s;
  &:hover {
    cursor: pointer;
    background-color: white;
    left: 0;
  }
}

.done {
  display: inline;
  position: absolute;
  right: -50px;
  top: 0;
  border: 1px solid lightblue;
  padding: 0 5px;
  border-bottom-left-radius: 5px;
  background-color: #d2caca;
  transition: right 0.3s;
  color: #992424;
  &:hover {
    cursor: pointer;
    background-color: white;
    right: 0;
  }
}

.adjustOptions {
  .leftRotate {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s;
    color: #992424;
    padding: 7px;
    &:hover {
      @extend %hover-effect;
      transform: translateY(-50%) rotate(-60deg);
    }
  }
  .rightRotate {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(30deg);
    font-size: 30px;
    transition: transform 0.3s;
    color: #992424;
    padding: 5px;
    &:hover {
      @extend %hover-effect;
      transform: translateY(-50%) rotate(120deg);
    }
  }
  .flip {
    position: absolute;
    display: inline-block;
    top: 330px;
    left:-20px;
    padding: 0 5px;
    border: 1px solid lightblue;
    background-color: #d2caca;
    transition:all 0.3s;
    border-radius: 0 5px 5px 0;
    &:hover {
      @extend %hover-effect;
      background-color: white;
      left:0;
    }

  }
}
</style>