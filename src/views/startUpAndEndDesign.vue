<template>
  <div id="startUpAndEndFace">
    <div class="changeFace">
      <div @click="face='start'" v-bind:class="{faceSelected:face=='start'}">游戏开始界面</div>|
      <div @click="face='end'" v-bind:class="{faceSelected:face=='end'}">游戏结束动画</div>
    </div>
    <face-component face="start" v-if="face=='start'" key="startFace"></face-component>
    <face-component face="end" v-else-if="face=='end'" key="endFace"></face-component>
  </div>
</template>

<script>
import faceComponent from "@/components/startUpAndEnd/faceComponent";
import mobileRouterDevice from "@/lib/mobileRouterProtect";

export default {
  name: "startUpAndEndFace",
  mixins: [mobileRouterDevice],
  components: { faceComponent },
  data: function() {
    return {
      face: "start"
    };
  }
};
</script>

<style scoped lang='scss'>
#startUpAndEndFace {
  padding-top: 50px;
  @media screen and (max-width: 920px) {
    padding-top: 0px;
  }
}

.faceSelected {
  color: red;
  font-weight: 900;
}

.changeFace {
  div {
    display: inline;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>