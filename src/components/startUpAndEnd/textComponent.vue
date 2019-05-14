<template>
  <div
    class="textComponent"
    v-on:mousedown.stop.prevent="moveComponent($event)"
    v-bind:style="style"
    v-on:click="$emit('change-textFocus',index)"
    v-if="!destroy"
  >
    <div
      v-on:click="editText()"
      v-bind:contenteditable="editable"
      v-on:blur="editable=false"
    >双击编辑</div>
  </div>
</template>

<script>
import componentMixin from "@/components/startUpAndEnd/componentMixin";

export default {
  name: "textComponent",
  mixins: [componentMixin],
  props: {
    fontSize: Number,
    color: String
  },
  data: function() {
    return {
      editable: false
    };
  },
  computed: {
    style() {
      return {
        top: this.pos.top + "px",
        left: this.pos.left + "px",
        border: this.currentFocus == this.index ? "2px solid blue" : "none",
        fontSize: this.fontSize + "px",
        color: this.color,
        opacity: this.opacity,
        transform: `rotate(${this.rotate}deg)`,
        zIndex: this.zIndex
      };
    }
  },
  methods: {
    editText() {
      event.target.focus();
      this.editable = true;
    }
  }
};
</script>

<style scoped lang='scss'>
.textComponent {
  position: absolute;
  &:hover {
    cursor: pointer;
  }
}
</style>