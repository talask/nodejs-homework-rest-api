const app = require("./app");

const mongoose = require('mongoose');
//const env = require('dot');

//const DB_HOST = "mongodb+srv://Natalya:aLQIpiovXG1LrT0o@cluster0.hiykldq.mongodb.net/connect_db?retryWrites=true&w=majority";
const { DB_HOST } = process.env;

mongoose.Promise = global.Promise;

mongoose.connect(process,env.DB_HOST);
// mongoose.connect(process.env.DB_HOST, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
