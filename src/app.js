const path = require('path');
const express = require('express');
const hbs = require('hbs');
const app = express();

/* setting port to be automatically loaded to listen method according to either if it is provided by heroku or is
local port */

//env object contains environment variables (set by Heroku)
const port = process.env.PORT || 3000;

const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

/* using template engine "handlebars" which cooperate with express */

// setting info for express which template engine should use
// app.set(key=setting name, value for setting)
app.set('view engine', 'hbs');

/* dir "views" is convention for template docs; hbs has this directory set up in itself;
if we want to replace "views" name */
app.set('views', viewsPath);

// setting directory from which hbs will take handlebars partials
hbs.registerPartials(partialPath);

/* to customize our server we can use "use" method;
to serve static files such as images, CSS and JS files, use the "express.static";
express.static(root, [options]) - root argument specifies the root directory from which to serve static assets */
app.use(express.static(publicDirPath));

// setting rendering a home page with using hbs
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Dasha'
    })
})

app.get('/about', (req, res) => {
    res.render('bout', {
        title: 'About Me',
        name: 'Dasha'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'You can contact us on bubu@goo.com',
        name: 'Dasha'
    })
})


// express automatically converts object in "res.send" to json format
/*req.query is an object containing a property for each query string parameter in the route; if there is no query
string, it is the empty object, {} */

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({
            error: 'Nezadali jste adresu!'
        })
    }
    /* TypeError: Cannot destructure property `latitude` of 'undefined' or 'null'
    solution: assignment of default value of the object parameter to empty object: */
    geoCode(address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                address: address,
                location: location,
                forecast: forecastData
            })
        })
    })
})

// setting "wild card"

/* in case of calling non-existent page we want to return meaningful message;
to do it we put wild card in url "*";
* this setting must be at the end of the code due to express follow the code sequence */

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error: 404',
        message: 'Help article not found',
        name: 'Dasha'
    });
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error: 404',
        message: 'Page not found',
        name: 'Dasha'
    });
})


// starting up a server

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
})



