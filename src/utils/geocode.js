const request = require('request');

const geoCode = (address, callback) => {
    // "encodeURIComponent" helps read special characters
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +
        '.json?access_token=pk.eyJ1IjoiZGFzaGFrYWxhIiwiYSI6ImNrMG1weHk1OTBwamgzY21qZnhqczkwaDMifQ.ZlK2HW9JS8T-R9q-M9j-dg' +
        '&limit=1';
    request({url, json: true}, (error, {body}) => {
        if(error) {
            callback('Chyba spojení!', undefined);
        } else if(!body.features) {
            callback('Zadejte adresu!', undefined);
        } else if(body.features.length === 0) {
            callback('Lokace neexistuje!', undefined);
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            });
        }
    })
}

module.exports = geoCode;


