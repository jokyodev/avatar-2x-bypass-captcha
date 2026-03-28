const router = require("express").Router();
const jwt = require("jsonwebtoken");
router.post("/", async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split("Bearer ")[1].trim();
    console.log("token", token);

    if (!token) {
      return res.status(403).json({ success: false });
    }
    // Xác minh token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false });
      }

      return res.status(200).json({ success: true });
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
