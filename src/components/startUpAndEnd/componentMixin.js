export default {
   data: function () {
      return {
         pos: {
            top: 100,
            left: 100
         }
      };
   },
   props: {
      index: { type: Number },
      currentFocus: { type: Number },
      opacity: { type: Number },
      rotate: { type: Number },
      zIndex: { type: Number },
      destroy: { type: Boolean },
      face:{type:String}
   },
   methods: {
      moveComponent(event) {
         let self = this;
         event.target.addEventListener("mousemove", move);
         let startX = event.clientX;
         let startY = event.clientY;
         let startLeft = self.pos.left;
         let startTop = self.pos.top;

         function move(event) {
            if (event.buttons == 0) {
               event.target.removeEventListener("mousemove", move);
               return;
            }
            let xDiff = event.clientX - startX;
            let yDiff = event.clientY - startY;
            self.pos.left = startLeft + xDiff;
            self.pos.top = startTop + yDiff;
         }
      }
   }
}