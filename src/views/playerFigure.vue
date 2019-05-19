<template>
  <div class="playerFigure">
    <transition name="pageTransition">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import mobileRouterDevice from '@/lib/mobileRouterProtect';

export default {
  name: "playerFigure",
  mixins:[mobileRouterDevice],
};
</script>

<style lang="scss" scoped>
.playerFigure {
  padding-top: 50px;
}
</style>
