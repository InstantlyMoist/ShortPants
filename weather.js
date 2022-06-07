exports.calculator = require('./calculator');
const request = require('request');

exports.getShortPantsFromWeather = ({location, apiKey, day}) => {
    return new Promise(function (resolve, reject) {
        if (!location || !apiKey) {
            reject(new Error('Missing location or apiKey'));
        }
        exports.getWeather(location, apiKey).then((weather) => {
            if (weather.error) {
                resolve({location: location});
                return;
            }
            const rainChance = weather.forecast.forecastday[day].day.daily_chance_of_rain;
            const temperature = weather.forecast.forecastday[day].day.maxtemp_c;
            const shorts = exports.calculator.canWearShortPants(rainChance, temperature);
            resolve({
                location: location,
                canWearShortPants: shorts,
                rainChance: rainChance,
                temperature: temperature,
                data: weather.forecast.forecastday[day]
                
            });
        });
    });
}

exports.getWeather = async (location, apiKey) => {
    return new Promise(function (resolve, reject) {
        const url = getApiUrl(location, apiKey);
        request(url, {json: true}, (err, res, body) => {
            resolve(body);
        });
    });
}

getApiUrl = (location, apiKey) => `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`;