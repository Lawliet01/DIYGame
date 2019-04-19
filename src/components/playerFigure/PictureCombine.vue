<template>
  <div id="pictureCombine">
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
      <span class="leftRotate" @click="rotate-=5">左转</span>
      <span class="rightRotate" @click="rotate+=5">右转</span>
      <div
        class="previewContainer"
        :style="{width:previewSize.width+'px',height:previewSize.height+'px'}"
      >
        <canvas class="previewCanvas" :width="previewSize.width" :height="previewSize.height"></canvas>
      </div>
    </div>
    <div class="adjustOptions">
      <div class="goback" @click="goBack()">back</div>
      <div class="resize">
        <input type="range" min="0.5" max="3" step="0.05" v-model.number="scale">
      </div>
      <div class="flip" @click="flip = !flip">flip</div>
      <div class="done" @click="generatePlayerFigure()">done</div>
    </div>
    <canvas class="testCanvas" width="480" height="600"></canvas>
  </div>
</template>

<script>
//girlHeadImg应该是imageData，要知道width和height,然后通过toDataURL生成图画
import { headLessBodyGroupImg, girlHeadImg } from "./lib/imgSource.js";


export default {
  name: "PictureCombine",
  mounted: function() {
    girlHeadImg.onload = () => {
      //应该通过putImageData来放入
      this.toCombineCanvasContext.drawImage(girlHeadImg, 0, 0, 200, 165);
    };
  },
  updated: function() {
    //清楚canvas
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
    //toCombinedCanvas
    this.drawCanvasAfterTransform(
      girlHeadImg,
      this.toCombineCanvasContext,
      this.imgContentPos.left,
      this.imgContentPos.top,
      200, //需要调整
      165
    );
    let ratio = this.previewSize.width / this.canvasContainerSize.width;
    this.drawCanvasAfterTransform(
      girlHeadImg,
      this.previewCanvasContext,
      this.imgContentPos.left * ratio,
      this.imgContentPos.top * ratio,
      30,
      25
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
    }
  },
  methods: {
    //返回
    goBack(){
      this.$router.push({path:'/playerFigure'})
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
          }, 100);
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
      let testCanvas = document.querySelector(".testCanvas");
      let testCanvasCx = testCanvas.getContext("2d");
      let topAdjusteds = [2, -2, -3, -4, 2, -2, -3, -3, 0, -3];
      testCanvasCx.drawImage(headLessBodyGroupImg, 0, 0);
      let ratio = this.previewSize.width / this.canvasContainerSize.width;
      for (let i = 0; i < 10; i++) {
        this.drawCanvasAfterTransform(
          girlHeadImg,
          testCanvasCx,
          this.imgContentPos.left * ratio + 48 * i,
          this.imgContentPos.top * ratio + topAdjusteds[i],
          30,
          25
        );
      }
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

.canvasContainer {
  border: 0.5px solid lightblue;
  position: relative;
  overflow: scroll;
  background-color: beige;
  @extend %background;

  .toCombineCanvas {
    position: absolute;
    top: 0;
    left: 0;
  }

  .leftRotate {
    position: absolute;
    left: 0;
    border: 1px solid lightblue;
    &:hover {
      @extend %hover-effect;
    }
  }
  .rightRotate {
    position: absolute;
    border: 1px solid lightblue;
    right: 0;
    &:hover {
      @extend %hover-effect;
    }
  }
  .previewContainer {
    position: absolute;
    right: 0;
    bottom: 0;
    border: 1px solid lightblue;
    @extend %background;
  }
}

.adjustOptions {
  div {
    display: inline;
    padding: 0 3px;
    border: 1px solid lightblue;
  }
  @each $option in goback flip done {
    .#{$option}:hover {
      @extend %hover-effect;
    }
  }
}
</style>