const router = require("express").Router();
const { downloadFile, uploadFile } = require("../controllers/files");
const verifyToken = require("../middleware/verifyToken");
router.get("/:license", downloadFile);
router.post("/upload", verifyToken, uploadFile);

module.exports = router;
