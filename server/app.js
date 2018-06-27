const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const routes = require("./routes");
const { DB } = require("./config/keys");

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection to DB was succesful");
  })
  .catch(e => {
    console.log("Cannot connect to database");
  });
app.use(bodyParser.json({ type: "*/*" }));
app.use(morgan("combined"));

app.use(routes);
app.listen(PORT, () => {
  console.log("Server is up and running");
});
