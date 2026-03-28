const License = require("../model/License");
const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const AdmZip = require("adm-zip");
const ErrorResponse = require("../utils/ErrorResponse");
const multer = require("multer");
exports.downloadFile = async (req, res, next) => {
  const { license } = req.params;
  try {
    const pattern = /^[a-zA-Z0-9]{30}$/;
    if (!pattern.test(license)) {
      return res
        .status(401)
        .send("Key không hợp lệ , vui lòng liên hệ admin để được hỗ trợ");
    }
    const findLicense = await License.findOne({
      name: license,
    });
    if (!findLicense)
      return res.status(404).send("License key không tồn tại trên hệ thống");

    const originalJarFilePath = path.join(
      __dirname,
      "..",
      "files",
      "avatar.jar"
    );
    const newJarFilePath = path.join(
      __dirname,
      "..",
      "files",
      `avatar2024.jar`
    );

    // Tạo một đối tượng AdmZip từ tệp ZIP gốc
    const zip = new AdmZip(originalJarFilePath);

    // Đọc dữ liệu từ tệp văn bản bạn muốn thêm vào

    // Thêm nội dung văn bản vào tệp ZIP
    zip.addFile("avatar_license.txt", Buffer.from(license, "utf-8"));

    // Ghi lại tệp ZIP mới với dữ liệu đã được thêm vào
    zip.writeZip(newJarFilePath, (err) => {
      if (err) {
        console.error("Lỗi khi ghi tệp ZIP mới:", err);
      } else {
        console.log("Đã append dữ liệu vào tệp ZIP thành công!");
      }
    });
    res
      .status(200)
      .download(path.join(__dirname, "..", "files", `avatar2024.jar`));
  } catch (error) {
    next(new ErrorResponse(error.message), 500);
  }
};
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "files"),
  filename: (req, file, cb) => {
    cb(null, "avatar.jar");
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 1000MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("myFile");
function checkFileType(file, cb) {
  return cb(null, true);
}
exports.uploadFile = async (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (req.file == undefined) {
        res.status(400).send("Error: No File Selected!");
      } else {
        res.send(`File Uploaded: ${req.file.filename}`);
      }
    }
  });
};
