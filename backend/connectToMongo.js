const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo = async () => {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to Mongo"))
    .catch((error) => console.log(error));
};

module.exports = connectToMongo;
