const router = require("express").Router();
const { checkUser, checkIp, logged, logout } = require("../controllers/user");
const { requireProxy } = require("../controllers/proxies");
router.post("/", checkUser);
router.post("/check", checkIp);
router.post("/logged", logged);
router.post("/logout", logout);
router.post("/proxy", requireProxy);

module.exports = router;
