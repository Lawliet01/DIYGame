
export function stringToArray(string){
   if (typeof string != 'string') throw new Error('argument not a string on stringToArray: ' + string)
   return string.trim().split("\n").map(l => {
      l = l.trim();
      return [...l]
   });
}

export function arrayToString(array){
   if (typeof array != 'object') throw new Error('argument not an array on arrayToString: ' + array)
   return array.map(row=> row.join('')).join('\n')
}

export function stringToMap(source,context){
   if (typeof source != 'string') throw new Error('argument not a string on stringToMap: ' + source)
   return source.trim().split("\n").map(row=>{
      return row.trim().split("").map(grid=>{
         let fileName = "";
         if (grid == 'o'){
            fileName = 'coinIcon'
         }else if (grid == '#'){
            fileName = 'wallIcon'
         }else if(grid == '+'||grid == '='||grid =='|'||grid =='v'){
            fileName = 'lavaIcon'
         }else if (grid == '@'){
            fileName = 'playerIcon'
         }else if(grid == 'm'){
            fileName = 'monsterIcon'
         }else if (grid == 'd'){
            fileName = 'dragonIcon'
         }
         if (fileName.length == 0){
            return {backgroundImage:"",pattern:'.'}
         }else {
            let src = context[fileName]
            if (src == undefined) throw new Error('can not found the image on pics: '+fileName)
            return {
               backgroundImage:`url(${src})`,
               pattern:grid
            }
         }
      })
   })
}

export function mapToString(map){
   if (typeof map != 'object') throw new Error('map is not an object on mapToString', + map)
   return map.map(row=>row.map(each=>{return each.pattern}).join('')).join('\n')
}
