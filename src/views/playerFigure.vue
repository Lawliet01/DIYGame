<template>
  <div class="playerFigure">
    <transition name="pageTransition">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "playerFigure"
};
</script>

<style lang="scss" scoped>
.playerFigure {
  padding-top: 50px;
}
</style>
