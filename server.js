const app = require("./app");

const mongoose = require('mongoose');



mongoose.Promise = global.Promise;

mongoose.connect(DB_HOST);

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
