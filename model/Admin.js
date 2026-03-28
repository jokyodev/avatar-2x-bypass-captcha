const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const AdminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
  },
});
AdminSchema.pre("save", async (next) => {
  try {
    // Generate a salt
    const salt = await bcryptjs.genSalt(10);
    // Hash password
    const passwordHash = await bcryptjs.hash(this.password, salt);
    // Replace plaintext password with hashed password
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("Admin", AdminSchema);
