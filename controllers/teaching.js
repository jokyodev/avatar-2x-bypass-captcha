const fs = require("fs");
const path = require("path");
exports.English = async (req, res, next) => {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "..", "data", "english.txt"),
      "utf-8"
    );
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
  }
};

exports.Vietnamese = async (req, res, next) => {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "..", "data", "vietnamese.txt"),
      "utf-8"
    );
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
  }
};
