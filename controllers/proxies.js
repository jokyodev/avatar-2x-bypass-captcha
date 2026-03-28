const License = require("../model/License");
const ErrorResponse = require("../utils/ErrorResponse");
exports.requireProxy = async (req, res, next) => {
  // nhận vào key
  try {
    const { license } = req.body;
    const pattern = /^[a-zA-Z0-9]{30}$/;

    if (!pattern.test(license)) {
      return next(new ErrorResponse("Invalid license key", 401));
    }

    const findLicense = await License.findOne({
      name: license,
    });

    if (!findLicense) return next(new Error("Invalid license key", 401));
    const proxy = await findLicense.proxy;

    res.status(200).send(proxy);
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
};
