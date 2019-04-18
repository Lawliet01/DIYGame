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
        :style="{top:toCombineCanvasStyle.top,left:toCombineCanvasStyle.left}"
      ></canvas>
      <span class="leftRotate" @click="rotate-=5">左转</span>
      <span class="rightRotate" @click="rotate+=5">右转</span>
      <canvas class="previewCanvas" :width="previewSize.width" :height="previewSize.height"></canvas>
    </div>
    <div class="adjustOptions">
      <div class="goback">back</div>
      <div class="resize">
        <input type="range" min="0.5" max="3" step="0.05" v-model.number="scale">
      </div>
      <div class="flip" @click="flip = !flip">flip</div>
      <div class="done">done</div>
    </div>
  </div>
</template>

<script>
import {
  oneBodyImg,
  headLessBodyGroupImg,
  girlHeadImg
} from "./lib/imgSource.js";

import { posStringToNumber } from "./lib/posStringToNumber";
import { flipCanvas } from "./lib/flipCanvas";

export default {
  name: "PictureCombine",
  mounted: function() {
    girlHeadImg.onload = () => {
      this.toCombineCanvasContext.drawImage(girlHeadImg, 0, 0, 200, 165);
    };
  },
  updated: function() {
     //this.toCombineCanvasContext.clearRect(0,0,this.canvasContainerSize.width,this.canvasContainerSize.height)
     //this.toCombineCanvasContext.translate
   //  this.previewCanvasContext.clearRect(
   //    0,
   //    0,
   //    this.previewSize.width,
   //    this.previewSize.height
   //  );
   //  this.previewCanvasContext.drawImage(oneBodyImg, 0, 0, 48, 60);
   //  let ratio = this.previewSize.width / this.canvasContainerSize.width;
   //  let top = posStringToNumber(this.toCombineCanvasStyle.top) * ratio;
   //  let left = posStringToNumber(this.toCombineCanvasStyle.left) * ratio;
   //  console.log(left);
    
   //  this.previewCanvasContext.save();
   //  //  this.previewCanvasContext.scale(this.scale, this.scale);
   //  //  this.previewCanvasContext.rotate((this.rotate * Math.PI) / 180);
   //  let factor = this.flip==true?-1:1;
   //  this.previewCanvasContext.translate(left,top);
   //  this.previewCanvasContext.scale(factor*this.scale,this.scale)
   //  this.previewCanvasContext.drawImage(girlHeadImg, 0, 0, 30, 25);
   //  this.previewCanvasContext.restore();

   //  function flipHorizontally(context, around, scale) {
   //    context.translate(around, 0);
   //    context.scale(-scale, scale);
   //    context.translate(-around, 0);
   //  }
  },
  data: function() {
    return {
      scale: 1,
      rotate: 0,
      flip: false,
      toCombineCanvasStyle: {
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
    },
    transform: function() {
      let factor = this.flip == true ? -1 : 1;
      return `scale(${factor * this.scale},${this.scale}) rotate(${factor *
        this.rotate}deg) `;
    }
  },
  methods: {
    //移动canvas
    moveCanvas: function() {
       let self = this;
      let { widthDiff, heightDiff } = this.mouseImgPosDiff(event);
      self.canvasContainerDOM.addEventListener("mousemove", startMove);
      function startMove(event) {
         if (event.buttons == 0) {
            self.canvasContainerDOM.removeEventListener("mousemove", startMove);
        }
        self.toCombineCanvasStyle.top =
          event.clientY -
          self.canvasContainerDOMRectPos().top -
          heightDiff +
          self.scaleDiff().yCompensate +
          "px";
        self.toCombineCanvasStyle.left =
          event.clientX -
          self.canvasContainerDOMRectPos().left -
          widthDiff +
          self.scaleDiff().xCompensate +
          "px";
      }
    },
    //位置信息
    canvasContainerDOMRectPos() {
      return this.canvasContainerDOM.getBoundingClientRect();
    },
    toCombineCanvasRectPos() {
      return this.toCombineCanvasDOM.getBoundingClientRect();
    },
    mouseImgPosDiff: function(originalEvent) {
      return {
        widthDiff: originalEvent.clientX - this.toCombineCanvasRectPos().left,
        heightDiff: originalEvent.clientY - this.toCombineCanvasRectPos().top
      };
    },
    scaleDiff: function() {
      //scale 改变后，top，left数据没有发生变化，但实际上是变化了的，需要“补偿“变化的部分
      let { top, left } = posStringToNumber(this.toCombineCanvasStyle);
      return {
        xCompensate:
          left -
          (this.toCombineCanvasRectPos().left -
            this.canvasContainerDOMRectPos().left),
        yCompensate:
          top -
          (this.toCombineCanvasRectPos().top -
            this.canvasContainerDOMRectPos().top)
      };
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

  .toCombineCanvas{
     position: absolute
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

  .previewCanvas {
    position: absolute;
    right: 0;
    bottom: 0;
    border: 1px solid lightblue;
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