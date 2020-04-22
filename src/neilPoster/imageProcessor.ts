import Jimp from 'jimp';

// let textData = {
//   text: '© JKRB Investments Limited', //the text to be rendered on the image
//   maxWidth: 1004, //image width - 10px margin left - 10px margin right
//   maxHeight: 72+20, //logo height + margin
//   placementX: 10, // 10px in on the x axis
//   placementY: 1024-(72+20)-10 //bottom of the image: height - maxHeight - margin
// };

export const addTextToImage = async (imgPath: string, imgText: string) => {

  const font = await Jimp.loadFont('./assets/imageFont.fnt');
  const image = await Jimp.read(imgPath);
  // const image = await Jimp.read(1000, 1000, 0x0000ffff);

  // image.print(font, 10, 10, {
  //   text: 'Hello world!',
  //   alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  //   alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
  // });

  // console.log('image is', image);
  // image.print(font, 10, 10, 'Hello World!');
  // image.print(font, -20, -20, {
  //   text: imgText,
  //   alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  //   alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
  // }, image.getWidth(), image.getHeight());

  // image.write(imgPath);

    // if (image.getWidth() > 600) {

  // }
    // image.resize(1080, Jimp.AUTO);

    // if (image.getWidth() < 1080) {
    //   image.resize(1080, Jimp.AUTO);
    // }

    image.resize(1080, 1080);

    image.print(font, -20, -20, {
      text: imgText,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
    }, image.getWidth(), image.getHeight());



// NOTES
    // NEed to check aspect ratio.
    // NEED top ensure that minimum width is 1080, and then that height is within a certain range.


  // if (image.getHeight() < 566) {
  //   image.resize(image.getWidth(), 567)
  // }

  // if (image.getHeight() > 1350) {
  //   image.resize(image.getWidth(), 1350)
  // }

  // if (image.getWidth() > 600) {
  //   image.resize(800, Jimp.AUTO);
  // }

  await image.writeAsync(imgPath);
  // await image.writeAsync('./src/neilPoster/20191221_joshdan-test.jpg');
}

// addTextToImage('./src/neilPoster/20191221_joshdan.jpg');
// addTextToImage('./src/neilPoster/20180810_2.jpg');
// addTextToImage('./src/neilPoster/20200125_fullband-josh.jpg');
// addTextToImage('./src/neilPoster/20191221_joshdan.jpg', 'Sat. 3/21 8:30pm @ The Delancey');
