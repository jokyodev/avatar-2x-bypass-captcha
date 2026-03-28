const router = require("express").Router();
const { resolveCaptcha } = require("../controllers/captcha");
router.post("/", resolveCaptcha);

module.exports = router;
