function getPicSrc(path, name, n = 1, type) {
   //如果只有一张图，那么name要有拓展名
   //如果有多张图，那么拓展名放在type里面
   let image = new Image();
   if (n == 1) {
      image.src = path + '/' + name;
      return image;
   } else {
      let imageSrc = Array.apply(null, { length: n }).map(function (_, index) {
         let number = index + 1;
         return path + '/' + name + number.toString() + '.' + type
      })
      return [image, imageSrc]
   }
}


describe('testGetPicSrc',()=>{
   
   // it('onePicture',()=>{
   //    let otherSprites = getPicSrc('../pic/pureGame/basicUse','sprites.png');
   //    expect(otherSprites.src).toBe('../pic/pureGame/basicUse/sprites.png');
   // })

   it('multiPicture',()=>{
      let [monsterSprites, monsterSpritesSrc] = getPicSrc('../pic/pureGame/actors','dragon',10,'png');
      expect(monsterSpritesSrc[0]).toBe('../pic/pureGame/actors/dragon1.png')
      expect(monsterSpritesSrc.length).toBe(10)
   })
})