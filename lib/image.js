var image_setting = async function cropImage(gambar, filename) {
  const image = await jimp.read(gambar);
  await image.resize(1000, jimp.AUTO, function (err) {
    if (err) {
      console.log(err);
    }
  });
  var w = image.bitmap.width;
  var h = image.bitmap.height;

  await image.crop(jimp.HORIZONTAL_ALIGN_CENTER, jimp.VERTICAL_ALIGN_MIDDLE, 800, 460);
  await image.writeAsync(`public/images/upload800x460/` + filename, function (err) {
    if (err) {
      console.log(err)
    }
  });
  await image.crop(jimp.HORIZONTAL_ALIGN_CENTER, jimp.VERTICAL_ALIGN_MIDDLE, 400, 510);
  await image.writeAsync(`public/images/upload400x600/` + filename, function (err) {
    if (err) {
      console.log(err)
    }
  });
}
module.exports = image_setting;