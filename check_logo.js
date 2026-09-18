const Jimp = require('jimp');

async function checkImage() {
  const image = await Jimp.read('public/logo.png');
  let opaquePixelsRightHalf = 0;
  
  const midX = Math.floor(image.bitmap.width / 2);
  
  image.scan(midX, 0, image.bitmap.width - midX, image.bitmap.height, function(x, y, idx) {
    if (this.bitmap.data[idx + 3] > 0) {
      opaquePixelsRightHalf++;
    }
  });

  console.log("Opaque pixels in right half:", opaquePixelsRightHalf);
  console.log("Total pixels in right half:", (image.bitmap.width - midX) * image.bitmap.height);
}

checkImage();
