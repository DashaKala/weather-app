const request = require('request');

const forecast = (latitute, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/2b996977d2bb9ee01b49611fc90218e4/' + latitute + ','
        + longitude + '?units=si&lang=cs';
    request({url, json: true}, (error, {body}) => {
        if(error) {
            callback('Chyba spojení!', undefined);
        } else if(body.error) {
            callback('Lokace neexistuje!', undefined);
        } else {
            callback(undefined, `${body.daily.data[0].summary} Prave je ${body.currently.temperature} stupňů Celsia. `+
            `Pravdepodobnost srazek je ${body.currently.precipProbability}%.`+
                `Nejvyšší denní teplota ${body.daily.data[0].temperatureHigh} stupňů Celsia. `+
                `Nejnižší denní teplota ${body.daily.data[0].temperatureLow} stupňů Celsia.`);
        }
    });
}

module.exports = forecast;