const { createCanvas, loadImage } = require("canvas");
const fs = require("fs").promises;

const path = require("path");
const capt = async (filename) => {
    try {

        // Load image
        const imagePath = path.resolve("./captcha/normal_captcha", filename);



        const image = await loadImage(imagePath);


        // Create a canvas and context
        const canvas = createCanvas(image.width, image.height);
        const context = canvas.getContext("2d");
        // Draw the image on the canvas
        context.drawImage(image, 0, 0);

        // Get the image data
        const imageData = context.getImageData(0, 0, image.width, image.height);
        const pixels = imageData.data;

        // Loop through each pixel and get the color values
        let colors = [];
        let originData = [];
        for (let i = 0; i < pixels.length; i += 4) {
            const red = pixels[i];
            const green = pixels[i + 1];
            const blue = pixels[i + 2];
            const alpha = pixels[i + 3];

            colors.push({ id: i, colors: `${red},${green},${blue},${alpha}` });
        }

        const bigData = [];
        for (let i = 0; i < 10; i++) {
            let filePath = "./data/" + i;
            const folderPath = filePath;

            const files = await fs.readdir(folderPath);

            const jsonFiles = files.filter((file) => path.extname(file) === ".json");

            for (let j = 0; j < jsonFiles.length; j++) {
                const data = await fs.readFile(
                    path.join(folderPath, jsonFiles[j]),
                    "utf8"
                );
                bigData.push({ object_label: i, object_content: JSON.parse(data) });
            }
        }
        let finalData = [];
        for (let i = 0; i < bigData.length; i++) {
            let checkCounter = 0;
            let currentDataTrained = bigData[i].object_content;
            let array = Object.values(currentDataTrained);
            if (array.length === colors.length) {
                let arrayFilterChecked = array.filter((item) => {
                    return item.isChecked;
                });
                let index = 0;
                for (let i = 0; i < array.length; i++) {
                    if (array[i].isChecked == true) {
                        if (array[i].colors === colors[i].colors) {
                            index++;
                        }
                    }
                }

                if (index === arrayFilterChecked.length) {
                    // return bigData[i].object_label;
                    finalData.push({ label: bigData[i].object_label, pixels: index });
                }
            }
        }


        if (finalData.length == 1) {
            return finalData[0].label;
        } else {
            let maxPixels = finalData[0];
            finalData.forEach((item) => {

                if (maxPixels.pixels < item.pixels) {
                    maxPixels = item;
                }
            });
            return maxPixels.label;
        }

        // console.log(finalData[1])
        // return finalData[0].label
    } catch (Err) {
        return "cvcc " + Err.message;
        console.log(Err);
    }
};

module.exports = capt;
