<template>
  <div id='startUpAndEndFace'>
    <div class='changeFace'>
      <div @click="face='start'" v-bind:class="{faceSelected:face=='start'}">游戏开始界面</div> |
      <div @click="face='end'" v-bind:class="{faceSelected:face=='end'}">游戏结束动画</div>
    </div>
    <face-component face="start" v-if="face=='start'" key='startFace'></face-component>
    <face-component face="end" v-else-if="face=='end'" key="endFace"></face-component>
  </div>
</template>

<script>

import faceComponent from '@/components/startUpAndEnd/faceComponent'



export default {
  name:'startUpAndEndFace',
  components:{faceComponent},
  data:function(){
    return{
      face:'start'
    }
  }
}
</script>

<style scoped lang='scss'>

.faceSelected{
  color:blue;
  font-weight:900
}

.changeFace{
  div{
    display: inline;
    &:hover{
      color:blue;
      text-decoration:underline;
      cursor: pointer;
    }
  }
}
  
</style>