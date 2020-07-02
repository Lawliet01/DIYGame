<template>
  <div
    class="textComponent"
    v-on:mousedown.stop="moveComponent($event)"
    v-bind:style="style"
    v-on:click="$emit('change-textFocus',index)"
    v-if="!destroy"
  >
    <div
      v-on:click="editText()"
      v-bind:contenteditable="editable"
      v-on:blur="saveText($event.target.textContent)"
    >{{textContent}}</div>
  </div>
</template>

<script>
import componentMixin from "@/components/startUpAndEnd/componentMixin";
import { mapGetters } from "vuex";

export default {
  name: "textComponent",
  mixins: [componentMixin],
  created() {
    let componentProperties =
      this.face == "start"
        ? this.getComponentPropertyByIndex("text", this.index)
        : this.endGetComponentPropertyByIndex("text", this.index);
    if (componentProperties === undefined) {
      this.textContent = this.lang === 1 ?"双击编辑":"Double click to edit"
      return;
    }
    this.pos.left = componentProperties.left;
    this.pos.top = componentProperties.top;
    this.textContent = componentProperties.textContent;
  },
  beforeDestroy() {
    if (this.destroy == true) return;
    const rawStyle = Object.assign({}, this.$props, this.$data.pos, {
      textContent: this.$data.textContent
    });
    if (this.face == 'start'){
      this.$store.commit("startUpFace/addTextComponents", rawStyle);
    }else if (this.face == 'end'){
      this.$store.commit("endFace/addTextComponents", rawStyle)
    }
  },
  props: {
    fontSize: Number,
    color: String
  },
  data: function() {
    return {
      editable: false,
      textContent: "双击编辑"
    };
  },
  computed: {
    ...mapGetters("startUpFace", ["getComponentPropertyByIndex"]),
    ...mapGetters("endFace", {
      endGetComponentPropertyByIndex: "getComponentPropertyByIndex"
    }),
    lang(){
      return this.$store.state.lang
    },
    style() {
      return {
        top: this.pos.top + "px",
        left: this.pos.left + "px",
        border: this.currentFocus == this.index ? "1px dashed red" : "none",
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
    },
    saveText(content) {
      this.editable = false;
      this.textContent = content;
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