const mongoose = require("mongoose");

const LicenseSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    maxlength: [30, "Độ dài của key không được quá 30 ký tự"],
  },
  author: {
    type: String,
    require: true,
    maxlength: [30, "Tên người dùng không được dài quá 30 ký tự"],
  },
  expiration: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    default: "0.0.0.0",
  },
  status: {
    type: String,
    default: "open",
  },
  onlineCount: {
    type: [String],
    default: [],
  },
  onlineLimit: {
    type: Number,
    default: 3,
  },
  proxies: {
    type: String,
    default: "none-proxy2",
    require: true,
  },
  accessIp: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("License", LicenseSchema);
