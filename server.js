const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//localhost

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/transaction", {
  useNewUrlParser: true,
  useFindAndModify: false
});

//for heroku use
mongoose.connect(process.env.MONGODB_URI || "mongodb://anushaodilzoda:Anushaj0n@ds053648.mlab.com:53648/heroku_c5zgjq4h", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});