<template>
  <div
    class="pictureComponent"
    v-on:mousedown.prevent.stop="moveComponent($event)"
    v-bind:style="style"
    v-on:click="$emit('change-pictureFocus',index)"
    v-if="!destroy"
  >
    <img v-bind:src="url" v-bind:width="width+'px'">
  </div>
</template>

<script>
import componentMixin from "@/components/startUpAndEnd/componentMixin";
import { mapGetters } from "vuex";

export default {
  name: "pictureComponent",
  mixins: [componentMixin],
  created() {
    let componentProperties = this.getComponentPropertyByIndex(
      "picture",
      this.index
    );
    if (componentProperties === undefined) return;
    this.pos.left = componentProperties.left;
    this.pos.top = componentProperties.top;
  },
  beforeDestroy() {
    if (this.destroy == true) return;
    const rawStyle = Object.assign({}, this.$props, this.$data.pos);
    this.$store.commit("startUpFace/addPictureComponents", rawStyle);
  },
  computed: {
    ...mapGetters("startUpFace", ["getComponentPropertyByIndex"]),
    style() {
      return {
        top: this.pos.top + "px",
        left: this.pos.left + "px",
        border: this.currentFocus == this.index ? "2px solid red" : "none",
        opacity: this.opacity,
        transform: `rotate(${this.rotate}deg)`,
        zIndex: this.zIndex,
        filter: this.filter
      };
    }
  },
  props: {
    url: {
      required: true,
      type: String
    },
    filter: { type: String },
    width: { type: Number }
  }
};
</script>

<style scoped lang='scss'>
.pictureComponent {
  position: absolute;
  &:hover {
    cursor: pointer;
  }
  img {
    display: block;
  }
}
</style>