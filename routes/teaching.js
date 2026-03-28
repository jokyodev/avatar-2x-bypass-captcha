const router = require("express").Router();

const { English, Vietnamese } = require("../controllers/teaching");
router.post("/english", English);
router.post("/vietnamese", Vietnamese);

module.exports = router;
