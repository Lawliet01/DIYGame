export function posStringToNumber(input) {
   if(typeof(input) == 'string'){
      return Number(input.slice(0, input.length - 2))
   }else if (typeof(input) == 'object'){
      let result = JSON.parse(JSON.stringify(input))
      for (let key of Object.keys(input)){
         result[key] = posStringToNumber(input[key])
      }
      return result
   }else{
      return input
   }
}