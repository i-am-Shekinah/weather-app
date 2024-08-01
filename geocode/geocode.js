const axios = require('axios');

require('dotenv').config();
const apiKey = process.env.OPENCAGE_API_KEY;

/**
 * 
 * @param {string} address The address to get coordinate for
 * @returns <objec> contains the lat, lng, add
 */
async function getLocationCoordinates(address) {
    if (!address) {
        throw new Error('Address is required');
    }
    try {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
        // https://api.opencagedata.com/geocode/VERSION/FORMAT?parameters
        const response = await axios.get(url);

        if (response.status === 200 && response.data.results.length > 0) {
            const lat = response.data.results[0].geometry.lat;
            const lng = response.data.results[0].geometry.lng;
            const add = response.data.results[0].formatted;
            return {
                lat,
                lng,
                add
            }
        } else if (response.status === 200 && response.data.results.length === 0) {
            return 'Unable to locate city';
        } else {
            return `Unexpected error: ${error.response.status} - ${error.response.statusText}`;
        }
    } catch (error) {
        if (error.response) {
            return `Geocode API Error: ${error.response.status} ${error.response.data}`;
        } else if (error.request) {
            return 'Network Error: Unable to connect to geocode\'s API';
        } else {
            return `Error: ${error.message}`;
        }
    }
}

module.exports = {
    getLocationCoordinates
};

// for testing purposes
// (async() => {
//     try {
//         const res = await getLocationCoordinates('London');
//         console.log(res);
//     } catch (error) {
//         console.log(error);
//         console.log(error.message);
//     }
// })();