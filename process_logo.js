const Jimp = require('jimp');

async function processImage() {
  try {
    const image = await Jimp.read('public/logo.jpg');
    
    // Check pixel at 10,10 (should be background)
    const bgColor = Jimp.intToRGBA(image.getPixelColor(10, 10));
    console.log("Background color near top-left:", bgColor);

    // Let's replace any pixel that is very close to black with transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      var red = this.bitmap.data[idx + 0];
      var green = this.bitmap.data[idx + 1];
      var blue = this.bitmap.data[idx + 2];
      
      // If the pixel is very dark (black background)
      if (red < 15 && green < 15 && blue < 15) {
        // this.bitmap.data[idx + 0] = 255;
        // this.bitmap.data[idx + 1] = 255;
        // this.bitmap.data[idx + 2] = 255;
        this.bitmap.data[idx + 3] = 0; // Transparent
      }
    });

    await image.writeAsync('public/logo.png');
    console.log("Image saved as public/logo.png");
  } catch (err) {
    console.error(err);
  }
}

processImage();
