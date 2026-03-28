const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URL);
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to db successfully");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
