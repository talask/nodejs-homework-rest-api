var Jimp = require("jimp");

const imageToJimp = async (pathToFile, newPathToFile) => {
  try {
    const image = await Jimp.read(pathToFile);
    await image.resize(250, 250).writeAsync(newPathToFile);
  } catch (err) {
    throw err;
  }
}

module.exports = imageToJimp;