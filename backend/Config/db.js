const mongoose = require("mongoose");
require("dotenv").config();

const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
    );
    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDb;
