const ErrorResponse = require("../utils/ErrorResponse");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { username: username },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "2h",
        }
      );

      return res.status(200).json({ success: true, token: token });
    }
    return res.status(400).json({ success: false, msg: "Invalid login" });
  } catch (error) {
    next(new ErrorResponse(error.message, 400));
  }
};
