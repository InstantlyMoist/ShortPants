let maxRainChance = 90;
let minTemperature = 15;

exports.setOptions = ({maxRainChance, minTemperature}) => {
    if (maxRainChance) {
        this.maxRainChance = maxRainChance;
    }
    if (minTemperature) {
        this.minTemperature = minTemperature;
    }
}

exports.canWearShortPants = (rainChance, temperature) => rainChance < maxRainChance && temperature > minTemperature;