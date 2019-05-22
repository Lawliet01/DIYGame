export default {
   created(){
      if (this.is_touch_device()) {
         alert('游戏设计需在电脑端完成，以获得最佳体验')
         this.$router.push('/')
      }
   },
   methods:{
      is_touch_device() {
         return (
            "ontouchstart" in window ||
            navigator.MaxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
         );
      },
   }
}