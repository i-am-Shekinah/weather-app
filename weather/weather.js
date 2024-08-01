const axios = require('axios');
const { getLocationCoordinates } = require('../geocode/geocode');

require('dotenv').config();
const apiKey = process.env.WEATHERMAP_API_KEY;

/**
 * 
 * @param {function} asynFunc an async function that returns a promise object
 * @param {object} address the user's typed-in address
 * @param {string} unit the unit to return the temperature in
 * @returns <object> add, lat, lng, temp
 */
async function fetchWeather(asynFunc, address, unit) {
    try {
        const geocodeObject = await asynFunc(address);
        if (typeof(geocodeObject) === 'object') {
            const { lat, lng, add } = geocodeObject;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=${unit}&appid=${apiKey}`;
            // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}`
            const response = await axios.get(url);
            let temp = response.data.main.temp;
            let pressure = response.data.main.pressure;
            let humidity = response.data.main.humidity;
            let desc = response.data.weather[0].description;
            // console.log(response.data);
            return {
                add,
                desc,
                humidity,
                lat,
                lng,
                pressure,
                temp,
            };
        } else {
            return geocodeObject;
        }
    } catch (error) {
        if (error.response) {
            return `Openweathermap API Error: ${error.response.status} - ${error.response.statusText}`;
        } else if (error.request) {
            return 'Network Error: Unable to reach openweathermap API';
        } else {
            return `Error: ${error.message}`;
        }
    }
}


module.exports = {
    fetchWeather
};

// for testing purposes
// (async() => {
//     try {
//         const res = await fetchWeather(getLocationCoordinates, 'London', 'imperial');
//         console.log(res);
//     } catch (error) {
//         console.error(error);
//     }
// })();