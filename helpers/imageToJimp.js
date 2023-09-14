var Jimp = require("jimp");

const imageToJimp = (pathToFile, newPathToFile) => {
   
    Jimp.read(pathToFile)
  .then((image) => {
   
    image.resize(250, 250).write(newPathToFile);
    return;
  })
  .catch((err) => {
   console.log(err)
  });

}

module.exports = imageToJimp;