const License = require("../model/License");
const randomKey = require("../utils/randomKey");
const ErrorResponse = require("../utils/ErrorResponse");
exports.getAllLicense = async (req, res, next) => {
  // complete
  try {
    const allLicense = await License.find();

    return res
      .status(200)
      .json({ success: true, count: allLicense.length, data: allLicense });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

exports.getOneLicense = async (req, res, next) => {
  //complete
  const { id } = req.params;

  try {
    const license = await License.findById(id);
    if (!license) next(new ErrorResponse("License not found", 404));

    res.status(200).json({ success: true, data: license });
  } catch (err) {
    next(new ErrorResponse("Server error", 500));
  }
};

exports.createLicense = async (req, res, next) => {
  // complete
  try {
    const { author, expiration, accessIp, proxies } = req.body;
    const key = randomKey(30);

    const newLicense = await License.create({
      name: key,
      author,
      expiration,
      proxies,
      accessIp,
    });
    res.status(201).json({ success: true, data: newLicense });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};
exports.updateLicense = async (req, res, next) => {
  // complete
  const { id } = req.params;
  try {
    const license = await License.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!license) next(new ErrorResponse("License not found", 404));

    res.status(200).json({ success: true, data: license });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};
exports.deleteLicense = async (req, res, next) => {
  // complete

  const { id } = req.params;

  try {
    const license = await License.findByIdAndDelete(id);
    console.log(license);

    if (!license) {
      return next(new ErrorResponse("No license found", 404));
    }

    res.status(200).json({ success: true, data: license });
  } catch (e) {
    next(new ErrorResponse(error.message, 500));
  }
};
exports.blockLicense = async (req, res, next) => {
  // complete
  const { id } = req.params;
  try {
    const license = await License.findByIdAndUpdate(
      id,
      {
        status: "block",
      },
      {
        new: true,
      }
    );
    if (!license) next(new ErrorResponse("License not found", 404));

    res.status(200).json({ success: true, data: license });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};
exports.unBlockLicense = async (req, res, next) => {
  // complete
  const { id } = req.params;
  try {
    const license = await License.findByIdAndUpdate(
      id,
      {
        status: "open",
      },
      {
        new: true,
      }
    );
    if (!license) next(new ErrorResponse("License not found", 404));

    res.status(200).json({ success: true, data: license });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};
