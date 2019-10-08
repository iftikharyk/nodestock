const express = require('express');
const app = express();
const path = require('path');
const exshbs = require('express-handlebars');
const request = require('request');

const PORT = process.env.PORT || 5000;

// Set handlebars Middleware
app.engine('handlebars', exshbs());
app.set('view engine', 'handlebars');

// Api key (public) pk_dbab12835ccf488daff61bba25814ee1
function callApi(finishedApi) {
    request('https://cloud.iexapis.com/stable/stock/fb/quote?token=pk_dbab12835ccf488daff61bba25814ee1', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
    
        if (res.statusCode === 200) {
            finishedApi(body);
        } else {
            console.log(res.statusCode);
        }
    });
}


// Set handlebar routes
app.get('/', function(req, res) {

    // Adding callback function
    callApi(function(doneApi) {
        res.render('home', {
            stock: doneApi
        });
    });

});

app.get('/about.html', function(req, res) {
    const otherstuff = "This is other stuff";
    res.render('about', {
        stuff: otherstuff
    });
});

// Routes (to public)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log('Server listening on port ' + PORT));