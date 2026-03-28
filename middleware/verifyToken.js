const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"].split("Bearer ")[1];

  if (!token) {
    return res.status(403).json({ success: false });
  }
  // Xác minh token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false });
    }

    // Nếu token hợp lệ, lưu thông tin user vào request để sử dụng cho các route sau này
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
