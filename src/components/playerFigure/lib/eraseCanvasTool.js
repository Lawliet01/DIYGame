//输入：x,y(圆心),radius,dataImage
//输出：返回一个dataImage

export function eraseCanvas(x,y,radius,dataImage){
   let oneFourthPixelsGroup = getOneFourthPixelsGroup(radius);
   let removingPixels = [];
   let boundary = {
      width: dataImage.width,
      height: dataImage.height
   }
   for (let i = 0;i<oneFourthPixelsGroup.length;i++){
      for (let j=0;j<oneFourthPixelsGroup[i];j++){
         let pixelLeft = x - j;
         let pixelRight = x + j;
         let pixelTop = y - i;
         let pixelBottom = y + i;
         let targetPixelsLeftTop = pixelsToPosition(pixelLeft, pixelTop,boundary);
         let targetPixelsRightTop = pixelsToPosition(pixelLeft, pixelBottom, boundary);
         let targetPixelsLeftBottom = pixelsToPosition(pixelRight, pixelTop, boundary);
         let targetPixelsRightBottom = pixelsToPosition(pixelRight, pixelBottom, boundary);
         let targetPixels = [targetPixelsLeftTop, targetPixelsRightTop, targetPixelsLeftBottom, targetPixelsRightBottom];
         targetPixels.forEach(p => {
            if (p == null) return;
            if (!removingPixels.includes(p)) {
               removingPixels.push(p)
            }
         })
      }
   }
   for (let i = 0; i < removingPixels.length; i++) {
      dataImage.data[removingPixels[i] * 4] = 255;
      dataImage.data[removingPixels[i] * 4 + 1] = 255;
      dataImage.data[removingPixels[i] * 4 + 2] = 255;
      dataImage.data[removingPixels[i] * 4 + 3] = 0;
   }
   return dataImage
}

function getOneFourthPixelsGroup(radius) {
   //获得像素点的结构数组。
   //因为橡皮擦是圆形，为了使得擦出的是圆形，就要知道在这个圆里每一行要擦掉多少个像素。
   //这个函数利用勾股定理，获得1/4圆部分每行要擦拭多少像素
   let row = [];
   for (let i = 0; i < radius; i++) {
      let pixels1 = Math.sqrt(radius * radius - i * i)
      let pixels2 = Math.sqrt(radius * radius - (i + 1) * (i + 1))
      let pixels = Math.round((pixels1 + pixels2) / 2)
      row.push(pixels)
   }
   return row;
}

function pixelsToPosition(widthDiff, heightDiff, limit) {
   //根据位置与canvasX、Y方向上的差距算出像素点在数组里的位置。
   if (widthDiff > limit.width || widthDiff < 0 || heightDiff > limit.height || heightDiff < 0) return null;
   return limit.width * heightDiff + widthDiff;
}

