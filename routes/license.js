const router = require("express").Router();

const {
  getAllLicense,
  getOneLicense,
  createLicense,
  updateLicense,
  deleteLicense,
  blockLicense,
  unBlockLicense,
} = require("../controllers/license");

router.route("/").get(getAllLicense).post(createLicense);
router
  .route("/:id")
  .get(getOneLicense)
  .put(updateLicense)
  .delete(deleteLicense);

router.route("/block/:id").put(blockLicense);
router.route("/unblock/:id").put(unBlockLicense);

module.exports = router;
