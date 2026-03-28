const License = require("../model/License");
const ErrorResponse = require("../utils/ErrorResponse");
exports.checkUser = async (req, res, next) => {
  const { license } = req.body;

  console.log(license);
  try {
    const pattern = /^[a-zA-Z0-9]{30}$/;
    if (!pattern.test(license)) {
      return next(new ErrorResponse("Invalid license key", 401));
    }
    console.log("Your IP" + req.clientIp);
    const findLicense = await License.findOneAndUpdate(
      {
        name: license,
      },
      {
        ipAddress: req.clientIp,
      },
      {
        new: true,
      }
    );

    if (!findLicense) {
      return next(new ErrorResponse("License not found", 404));
    }
    console.log(findLicense);

    // check ip , nếu ip khác với ip đã add thì không cho vào
    const requestIp = req.clientIp;
    if (requestIp !== findLicense.ipAddress) {
      // block luôn key đi nhé
      await License.findOneAndUpdate(
        {
          name: license,
        },
        {
          status: "block",
        },
        {
          new: true,
        }
      );
      return next(
        new ErrorResponse(
          "Bạn không có quyển truy cập thông tin này từ hệ thống -block ",
          500
        )
      );
    }
    if (findLicense.status === "block") {
      return next(
        new ErrorResponse(
          "Bạn không có quyển truy cập thông tin này từ hệ thống - block 2",
          500
        )
      );
    }

    return res
      .status(200)
      .send(findLicense.author + "|" + findLicense.expiration);
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

exports.logged = async (req, res, next) => {
  const dev = true;
  if (dev) return res.status(200).send("dev");
  const { license, account } = req.body;

  try {
    const pattern = /^[a-zA-Z0-9]{30}$/;
    const accountPattern = /^[a-zA-Z0-9]{1,20}$/;

    if (!accountPattern.test(account)) {
      return next(new ErrorResponse("Invalid account", 401));
    }
    if (!pattern.test(license)) {
      return next(new ErrorResponse("Invalid license key", 401));
    }
    const findLicense = await License.findOne({
      name: license,
    });
    if (!findLicense) {
      return next(new ErrorResponse("License not found", 404));
    }
    let accounts = findLicense.onlineCount;
    const limit = findLicense.onlineLimit;
    const index = accounts.indexOf(account);

    if (index !== -1) {
      accounts.splice(index, 1);
    } else if (index === -1 && accounts.length > 1) {
      accounts = accounts.pop();
    }

    accounts.push(account);

    if (accounts.length > limit) {
      return next(new ErrorResponse("Has Limited", 400));
    }

    const updateLicense = await License.findOneAndUpdate(
      { name: license }, // Điều kiện tìm kiếm cụ thể
      { onlineCount: accounts }, // Cập nhật trường
      { new: true } // Trả về tài liệu đã cập nhật
    );

    return res.status(200).send("oke");
  } catch (error) {
    return new ErrorResponse(error.message, 500);
  }
};

exports.logout = async (req, res, next) => {
  const dev = true;
  if (dev) return res.status(200).send("dev");
  const { license, account } = req.body;
  try {
    const pattern = /^[a-zA-Z0-9]{30}$/;
    const accountPattern = /^[a-zA-Z0-9]{20}$/;

    if (!pattern.test(license)) {
      return next(new ErrorResponse("Invalid license key", 401));
    }
    if (!accountPattern.test(account)) {
      return next(new ErrorResponse("Invalid account", 401));
    }
    const findLicense = await License.findOne({
      name: license,
    });
    if (!findLicense) {
      return next(new ErrorResponse("License not found", 404));
    }

    await License.findOneAndUpdate(
      {
        name: license,
      },
      {
        onlineCount: accounts,
      },
      {
        new: true,
      }
    );
    return res.status(200).send("oke");
  } catch (error) {
    return new ErrorResponse(error.message, 500);
  }
};

exports.checkIp = async (req, res, next) => {
  // complete
  const { license } = req.body;
  try {
    const pattern = /^[a-zA-Z0-9]{30}$/;
    if (!pattern.test(license)) {
      return next(new ErrorResponse("Invalid license key", 401));
    }
    const ip = req.clientIp;
    const findLicense = await License.findOne({
      name: license,
    });
    if (!findLicense) {
      return next(new ErrorResponse("License not found", 404));
    }

    if (
      (findLicense.ipAddress === ip) == false &&
      findLicense.name !== "admin"
    ) {
      return res.status(200).send("change-ip");
    }
    res.status(200).send("save-ip");
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};
