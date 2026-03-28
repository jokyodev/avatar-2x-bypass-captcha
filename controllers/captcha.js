const License = require("../model/License");

const path = require("path");
const fs = require("fs").promises;
const { createCanvas, loadImage } = require("canvas");
const capt = require("../utils/captcha_detect");
const ErrorResponse = require("../utils/ErrorResponse");

async function getCaptResult(split) {
  const letter1 = await capt(`section_${split[0]}.png`);
  const letter2 = await capt(`section_${split[1]}.png`);
  const letter3 = await capt(`section_${split[2]}.png`);
  const letter4 = await capt(`section_${split[3]}.png`);
  return letter1 + "" + letter2 + letter3 + letter4;
}
exports.resolveCaptcha = async (req, res, next) => {
  const { license, captcha } = req.body;

  try {
    const pattern = /^[a-zA-Z0-9]{30}$/;
    if (!pattern.test(license)) {
      return next(new ErrorResponse("Invalid license key", 401));
    }

    // bắt đầu giải captcha

    // Tách chuỗi base64 ra khỏi header
    const data = captcha.replace(/^data:image\/\w+;base64,/, "");

    // Chuyển đổi chuỗi base64 thành buffer
    const buffer = Buffer.from(data, "base64");

    // Lưu buffer thành file ảnh
    let fileSaveName = Math.random();
    let sPath = path.join(
      __dirname,
      "..",
      "captcha",
      "tmp_captcha",
      fileSaveName + ".png"
    );

    await fs.writeFile(sPath, buffer);

    let split = [Math.random(), Math.random(), Math.random(), Math.random()];
    let img;
    try {
      let sPath = path.join(
        __dirname,
        "..",
        "captcha",
        "tmp_captcha",
        fileSaveName + ".png"
      );
      img = await loadImage(sPath);

      const ratios = [0.16, 0.12, 0.08, 0.4];

      // Create canvas for each section and save to file
      let xOffset = [0, 12, 21, 29];

      for (let i = 0; i < ratios.length; i++) {
        const ratio = ratios[i];
        const sectionWidth = Math.round(img.width * ratio);

        const canvas = createCanvas(sectionWidth, img.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          xOffset[i],
          0,
          sectionWidth,
          img.height,
          0,
          0,
          sectionWidth,
          img.height
        );
        let sPath = path.join(
          __dirname,
          "..",
          "captcha",
          "normal_captcha",
          `section_${split[i]}.png`
        );
        await fs.writeFile(sPath, canvas.toBuffer("image/png"));
        // xử lý captcha
      }
      let r = await getCaptResult(split);

      if (r.length == 4) {
        let sPath = path.join(
          __dirname,
          "..",
          "captcha",
          "tmp_captcha",
          fileSaveName + ".png"
        );
        await fs.unlink(sPath);
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[0]}.png`
          )
        );
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[1]}.png`
          )
        );
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[2]}.png`
          )
        );
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[3]}.png`
          )
        );

        res.send(r + "|ok");
        return;
      } else {
        let sPath = path.join(
          __dirname,
          "..",
          "captcha",
          "tmp_captcha",
          fileSaveName + ".png"
        );
        await fs.unlink(sPath);
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[0]}.png`
          )
        );
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[1]}.png`
          )
        );
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[2]}.png`
          )
        );
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[3]}.png`
          )
        );
        res.send("-1" + "|fail-captcha");
        return;
      }
    } catch (ed) {
      console.log(ed);
      try {
        let sPath = path.join(
          __dirname,
          "..",
          "captcha",
          "tmp_captcha",
          fileSaveName + ".png"
        );
        await fs.unlink(sPath);
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[0]}.png`
          )
        );
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[1]}.png`
          )
        );
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[2]}.png`
          )
        );
        await fs.unlink(
          path.join(
            __dirname,
            "..",
            "captcha",
            "normal_captcha",
            `section_${split[3]}.png`
          )
        );
        res.send("HIHI");
      } catch (ee) {
        res.send("HIHI");
      }
    }
  } catch (error) {
    next(new ErrorResponse("Server error", 500));
  }
};
