<template>
  <div id="pictureEdit">
    <div class="pictureEditContainer" v-if="imgSrc.length != 0">
      <div class="canvasContainer" @mousedown="editCanvas($event)">
        <canvas
          class="pictureEditCanvas"
          v-bind:width="canvasDimension.width"
          v-bind:height="canvasDimension.height"
          v-bind:style="canvasDimension"
        ></canvas>
        <div
          class="cropFrame"
          v-if="mode=='crop'"
          @mousedown.stop="moveCropFrame($event)"
          v-bind:style="cropFrameDimension"
        ></div>
      </div>
      <div class="pictureEdit_toolKit">
        <div class="resize">
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.05"
            v-model="canvasDimension.scale"
            @input="resize()"
          >
        </div>
        <div class="drag" @click="mode='drag'">drag</div>
        <div class="crop" @click="mode='crop'">crop</div>
        <div class="erase" @click="mode='erase'">erase</div>
        <div class="undo">undo</div>
        <div class="reset">reset</div>
        <div class="toolState">
          <div v-if="mode == 'crop'">
            <button @click="cutCanvas()">cut</button>
            <button @click="removeCropFrame()">remove</button>
          </div>
          <div v-else-if="mode == 'erase'">erase</div>
        </div>
      </div>
    </div>
    <br>
    <button @click="addPicture()" v-if="imgSrc.length == 0">添加图片</button>
  </div>
</template>

<script>
import { isTSExpressionWithTypeArguments } from "@babel/types";
import { posStringToNumber } from "../../../lib/posStringToNumber";

export default {
  name: "pictureEdit",
  data: function() {
    return {
      imgSrc: "",
      imgData: null,
      historyData: [],
      canvasDimension: {
        width: 700,
        height: 400,
        top: 0,
        left: 0,
        scale: 1,
        ratio: 1
      },
      cropFrameDimension: {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      },
      mode: "drag"
    };
  },
  computed: {
    context: function() {
      return document.querySelector(".pictureEditCanvas").getContext("2d");
    },
    canvasContainer: function() {
      return this.imgSrc.length != 0
        ? document.getElementsByClassName("canvasContainer")[0]
        : null;
    },
    canvasDOM: function() {
      return this.imgSrc.length != 0
        ? document.getElementsByClassName("pictureEditCanvas")[0]
        : null;
    }
  },
  methods: {
    //放大缩小
    resize() {
      //resize通过改变canvas的大小 + 重画来改变图案大小，重画会尝试自动填满canvas
      this.context.clearRect(
        0,
        0,
        this.canvasDimension.width,
        this.canvasDimension.height
      );
      // this.canvasDimension.width = 700 * this.canvasDimension.scale;
      // this.canvasDimension.height = 400 * this.canvasDimension.scale;
      console.log('happy')
      let scale = this.canvasDimension.scale;
      this.context.save();
      this.context.scale(scale, scale);
      let { x, y, data } = this.historyData[0];
      this.context.putImageData(data, x, y,x,y,this.canvasDimension.width*scale,this.canvasDimension.height*scale)//,0,0,700,100);
      this.context.restore();

    },
    //处理canvas
    editCanvas(event) {
      switch (this.mode) {
        case "drag":
          return this.moveCanvas(event);
          break;
        case "crop":
          return this.drawCropFrame(event);
          break;
        case "erase":
          break;
      }
    },
    //移除cropFrame
    removeCropFrame() {
      this.cropFrameDimension.width = 0;
      this.cropFrameDimension.height = 0;
      this.mode = "drag";
    },
    //剪切canvas
    cutCanvas() {
      let { top, left, width, height } = posStringToNumber(
        this.cropFrameDimension
      );
      let x = left - posStringToNumber(this.canvasDimension.left);
      let y = top - posStringToNumber(this.canvasDimension.top);

      let newImageData = this.context.getImageData(x, y, width, height);

      this.context.clearRect(
        0,
        0,
        this.canvasDimension.width,
        this.canvasDimension.height
      );

      this.context.putImageData(newImageData, x, y);
      this.historyUpdate(x, y);
      this.removeCropFrame();
    },
    //移动cropFrame
    moveCropFrame(event) {
      let self = this;
      let { xDiff, yDiff } = this.mouseCropFramePosDiff(event);
      self.canvasContainer.addEventListener("mousemove", startMove);
      function startMove(event) {
        if (event.buttons == 0) {
          self.canvasContainer.removeEventListener("mousemove", startMove);
        }
        self.cropFrameDimension.top =
          event.clientY - self.canvasContainerRectPos().top - yDiff + "px";
        self.cropFrameDimension.left =
          event.clientX - self.canvasContainerRectPos().left - xDiff + "px";
      }
    },
    //画cropFrame
    drawCropFrame(event) {
      let self = this;
      let originalMouseX = event.clientX;
      let originalMouseY = event.clientY;
      this.canvasContainer.addEventListener("mousemove", startDraw);
      let originalX = originalMouseX - this.canvasContainerRectPos().left;
      let originalY = originalMouseY - this.canvasContainerRectPos().top;

      function startDraw(event) {
        if (event.buttons == 0) {
          self.canvasContainer.removeEventListener("mousemove", startDraw);
        }
        let xDiff = event.clientX - originalMouseX;
        let yDiff = event.clientY - originalMouseY;
        self.cropFrameDimension.width = Math.abs(xDiff) + "px";
        self.cropFrameDimension.height = Math.abs(yDiff) + "px";
        self.cropFrameDimension.top =
          yDiff > 0 ? originalY + "px" : originalY + yDiff + "px";
        self.cropFrameDimension.left =
          xDiff > 0 ? originalX + "px" : originalX + xDiff + "px";
      }
    },
    //拖动canvas
    moveCanvas(event) {
      let self = this;
      let { widthDiff, heightDiff } = this.mouseImgPosDiff(event);
      self.canvasContainer.addEventListener("mousemove", startMove);
      function startMove(event) {
        if (event.buttons == 0) {
          self.canvasContainer.removeEventListener("mousemove", startMove);
        }
        self.canvasDimension.top =
          event.clientY - self.canvasContainerRectPos().top - heightDiff + "px";
        self.canvasDimension.left =
          event.clientX - self.canvasContainerRectPos().left - widthDiff + "px";
      }
    },
    //获取位置信息
    canvasContainerRectPos: function() {
      return this.canvasContainer.getBoundingClientRect();
    },
    canvasRectPos: function() {
      return this.canvasDOM.getBoundingClientRect();
    },
    mouseImgPosDiff: function(originalEvent) {
      return {
        widthDiff: originalEvent.clientX - this.canvasRectPos().left,
        heightDiff: originalEvent.clientY - this.canvasRectPos().top
      };
    },
    mouseCropFramePosDiff: function(originalEvent) {
      let cropFramePos = document
        .getElementsByClassName("cropFrame")[0]
        .getBoundingClientRect();
      return {
        xDiff: originalEvent.clientX - cropFramePos.left,
        yDiff: originalEvent.clientY - cropFramePos.top
      };
    },
    //首次加载图片
    initCanvas() {
      if (this.imgSrc.length == 0) return;
      //首次加载
      let img = new Image();
      img.src = this.imgSrc;
      img.onload = () => {
        let imgWidth = img.width;
        let imgHeight = img.height;
        let { width, height } = this.canvasDimension;
        let ratio = (this.canvasDimension.ratio =
          width / imgWidth < height / imgHeight
            ? width / imgWidth
            : height / imgHeight);

        //保证整个图片能囊括在canva里面，并自动填满canvas。
        this.context.drawImage(img, 0, 0, imgWidth * ratio, imgHeight * ratio);
        this.historyUpdate(0, 0);
      };
    },
    //把canvas数据放到history中
    historyUpdate(x, y) {
      //获得全canvas数据
      //但指明要样式的未知
      let { width, height } = this.canvasDimension;
      let newImageData = this.context.getImageData(0, 0, width, height);
      console.log(newImageData);
      this.historyData.unshift({
        x: x,
        y: y,
        data: newImageData
      });
    },
    //添加图片
    addPicture() {
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.addEventListener("change", () => {
        if (input.files[0] == null) {
          console.log("failed to load img");
        } else {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            this.imgSrc = reader.result;
            this.initCanvas();
          });
          reader.readAsDataURL(input.files[0]);
        }
      });
      input.click();
      input.remove();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$toolKit-list: resize drag crop erase undo reset toolState;

%hover-effect {
  cursor: pointer;
  opacity: 0.8;
}
%move-effect {
  cursor: grab;
}

.canvasContainer {
  width: 100%;
  height: 400px;
  border: 0.5px solid lightblue;
  position: relative;
  overflow: scroll;

  canvas {
    position: absolute;
  }

  .cropFrame {
    position: absolute;
    border: 2px black dashed;

    &:hover {
      @extend %move-effect;
      border-color: red;
    }
  }
}
.pictureEdit_toolKit {
  div {
    display: inline-block;
    border: 1px solid lightblue;
    padding: 0 3px;
    border-top: none;
  }
  @each $className in $toolKit-list {
    @if $className != resize and $className != toolState {
      .#{$className}:hover {
        @extend %hover-effect;
      }
    }
  }
}
</style>
