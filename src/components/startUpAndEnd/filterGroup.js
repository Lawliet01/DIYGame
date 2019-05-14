export default {
   data:function(){
      return {
         filterGroup:[
            {
               name: "无",
               value: "none"
            },
            {
               name: "blur",
               value: "blur(4px)"
            },
            {
               name: 'brightness',
               value: 'brightness(250%)'
            },
            {
               name:'contrast',
               value:"contrast(180%)"
            },
            {
               name: 'grayscale',
               value: "grayscale(100%)"
            },
            {
               name: 'hue-rotate',
               value: "hue-rotate(180deg)"
            },
            {
               name: 'invert',
               value: "invert(100%)"
            },
            {
               name: 'saturate',
               value: "saturate(7)"
            },
            {
               name: 'sepia',
               value: "sepia(100%)"
            },
            {
               name: 'drop-shadow',
               value: "drop-shadow(8px 8px 10px green)"
            },
         ]
      }
   }
}