const express = require("express");
const dotenv = require("dotenv");
const verifyToken = require("./middleware/verifyToken");
const rateLimit = require("express-rate-limit");
const requestIp = require("request-ip");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
dotenv.config({ path: "./config/config.env" });
const errorHandler = require("./middleware/errorHandler");

const licenseRoutes = require("./routes/license");
const techingRoutes = require("./routes/teaching");
const userRoutes = require("./routes/user");
const filesRoutes = require("./routes/files");
const captchaRoutes = require("./routes/captcha");
const authRoutes = require("./routes/auth");
const protectRoutes = require("./routes/protect");
const app = express();

const limiter = rateLimit({
  windowMs: 1000, // 1 giây
  max: 1000, // cho phép tối đa 50 requests mỗi IP mỗi 1 giây
  message: "Too many requests from this IP, please try again after a second",
});

app.use(
  cors({
    origin: "*", // Cho phép tất cả
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.static("files"));
app.use(helmet());
app.use(limiter);
app.use(requestIp.mw());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/api/v1/license/", verifyToken, licenseRoutes); // need verify
app.use("/api/v1/teaching/", techingRoutes); // no-need verify
app.use("/api/v1/user/", userRoutes); // no-need verify
app.use("/api/files/", filesRoutes); // no-need verify
app.use("/api/v1/captcha/", captchaRoutes); // no-need verify
app.use("/api/v1/login", authRoutes); //no-need verify
app.use("/api/protect", protectRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 3000;

app.listen(8080, "0.0.0.0", () => {
  connectDB();
  console.log("Server is running on port " + PORT);
});
