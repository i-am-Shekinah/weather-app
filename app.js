const yargs = require('yargs');

const { fetchWeather } = require('./weather/weather');
const { getLocationCoordinates } = require('./geocode/geocode');

const argv = yargs
    .options({
        a: {
            describe: 'The Address to get coordinates for',
            demand: true,
            alias: 'address',
            string: true
        },
        u: {
            describe: 'The unit of the temperature (imperial, metric, standard). This flag is optional, and if no value is supplied, the standard system will be used by default',
            demand: false,
            alias: 'unit',
            string: true
        }
    })
    .help()
    .argv;

let address = argv.a;
let unit = argv.u;
if (unit !== 'imperial' && unit !== 'metric') {
    unit = 'standard';
}
let unitMapping = {
    'imperial': 'F',
    'metric': 'C',
    'standard': 'K'
};

(async() => {
    try {
        const obj = await fetchWeather(getLocationCoordinates, address, unit);
        if (typeof(obj) === 'object') {
            const { add, desc, humidity, lat, lng, pressure, temp } = obj;
            console.log(`Address: ${add}`);
            console.log(`Latitude: ${lat}`);
            console.log(`Longitude: ${lng}`);
            console.log(`Humidity: ${humidity}%`);
            console.log(`Pressure: ${pressure}hPa`);
            console.log(`Temperature: ${temp}${unitMapping[unit]}`);
            console.log(`Description: ${desc}`);
            // console.log(res);
        } else {
            console.log(obj);
        }
    } catch (error) {
        console.error(error);
    }
})()