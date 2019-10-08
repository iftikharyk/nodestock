const express = require('express');
const app = express();
const path = require('path');
const exshbs = require('express-handlebars');
const request = require('request');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

// Use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// Api key (public) pk_dbab12835ccf488daff61bba25814ee1
function callApi(finishedApi, ticker) {
    request('https://cloud.iexapis.com/stable/stock/'+ticker+'/quote?token=pk_dbab12835ccf488daff61bba25814ee1', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
    
        if (res.statusCode === 200) {
            finishedApi(body);
        } else {
            console.log(res.statusCode);
        }
    });
}


// Set handlebars Middleware
app.engine('handlebars', exshbs());
app.set('view engine', 'handlebars');

// Set handlebar index GET route
app.get('/', function(req, res) {

    // Adding callback function
    callApi(function(doneApi) {
        res.render('home', {
            stock: doneApi
        });
    }, "fb");

});

// Set handlebar index POST route
app.post('/', function(req, res) {

    // Adding callback function
    callApi(function(doneApi) {
        // posted_stuff = req.body.stock_ticker;
        res.render('home', {
            stock: doneApi,
            // search_stuff: posted_stuff
        });
    }, req.body.stock_ticker);

});

// Set handlebars about route
app.get('/about.html', function(req, res) {
    const otherstuff = "This is other stuff";
    res.render('about', {
        stuff: otherstuff
    });
});

// Routes (to public)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server listening on port ' + PORT));