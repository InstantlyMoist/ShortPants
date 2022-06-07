const shortPantsCalculator = require("./calculator");
const weatherProvider = require("./weather");
const color = require("./utils/color");
const { createCanvas, loadImage } = require("canvas");
const fs = require('fs');

const iconHeight = 52;
const iconWidth = 52;
const heightDifference = 8;
const midOffset = 0;
const informationHeight = 880;

exports.createImage = async (apiResponse) => {
    return new Promise(async (resolve, reject) => {
        let buffer;
        if (apiResponse.rainChance == null || apiResponse.temperature == null) {
            const unknownImage = await exports.createUnknownImage(apiResponse);
            buffer = unknownImage.buffer;
        } else {
            const shortPants = shortPantsCalculator.canWearShortPants(apiResponse.rainChance, apiResponse.temperature);
            const canvas = createCanvas(1080, 1080);
            const context = canvas.getContext("2d");
    
            context.imageSmoothingEnabled = false;
    
            context.fillStyle = color.lightColor(shortPants);
            context.fillRect(0, 0, canvas.width, canvas.height);
    
            context.font = "bold 64px Roboto";
            context.fillStyle = color.darkColor(shortPants);
            context.fillText("Kan ik vandaag een korte \nbroek aan?", 64, 128);
    
            const weatherImage = await loadImage(__dirname + "/assets/" + (shortPants ? "/yes-man" : "/no-man") + ".png");
            const widthAspect = weatherImage.width > weatherImage.height;
            const desiredWidth = widthAspect ? 500 : 500 * (500 / weatherImage.height);
            const desiredHeight = widthAspect ? 500 * (desiredWidth / weatherImage.width) : 500;
            context.drawImage(weatherImage, (canvas.width / 2) - (desiredWidth / 2), (canvas.height / 2) - (desiredHeight / 2) + midOffset, desiredWidth, desiredHeight);
    
            const locationIcon = await loadImage(`${__dirname}/assets/location_${shortPants ? "orange" : "blue"}.png`);
            context.drawImage(locationIcon, 64, informationHeight, iconWidth, iconHeight);
    
            context.font = "32px Roboto";
            context.fillText(apiResponse.location, 128, informationHeight + 36);
    
            const rainIcon = await loadImage(`${__dirname}/assets/drop_${shortPants ? "orange" : "blue"}.png`);
            context.drawImage(rainIcon, 64, informationHeight + (heightDifference + iconHeight), iconWidth, iconHeight);
    
            context.fillText(`${apiResponse.rainChance}% kans`, 128, informationHeight + (heightDifference + iconHeight) + 36);
    
            const temperatureIcon = await loadImage(`${__dirname}/assets/temperature_${shortPants ? "orange" : "blue"}.png`);
            context.drawImage(temperatureIcon, 64, informationHeight + (heightDifference + iconHeight) * 2, iconWidth, iconHeight);
    
            context.fillText(`${apiResponse.temperature}°C`, 128, informationHeight + (heightDifference + iconHeight) * 2 + 36);
            buffer = canvas.toBuffer('image/jpeg');
        }
 
        resolve({
            buffer, apiResponse
        });
    });
}

exports.createUnknownImage = async (apiResponse) => {
    return new Promise(async (resolve, reject) => {
        const canvas = createCanvas(1080, 1080);
        const context = canvas.getContext("2d");

        context.imageSmoothingEnabled = false;

        context.fillStyle = "#CFE1CF";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = "bold 64px Roboto";
        context.fillStyle = "#387932";
        context.fillText("Kan ik vandaag een korte \nbroek aan?", 64, 128);

        const weatherImage = await loadImage(`${__dirname}/assets/unknown-man.png`);
        const widthAspect = weatherImage.width > weatherImage.height;
        const desiredWidth = widthAspect ? 500 : 500 * (500 / weatherImage.height);
        const desiredHeight = widthAspect ? 500 * (desiredWidth / weatherImage.width) : 500;
        context.drawImage(weatherImage, (canvas.width / 2) - (desiredWidth / 2), (canvas.height / 2) - (desiredHeight / 2) + midOffset, desiredWidth, desiredHeight);

        context.font = "32px Roboto";
        context.fillText(`Sorry, we konden het weer voor\n${apiResponse.location} \nniet inladen!`, 128, informationHeight + 36);

        const buffer = canvas.toBuffer('image/jpeg');

        resolve({
            buffer, apiResponse
        });
    });
}