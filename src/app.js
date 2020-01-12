const path = require('path');
var bodyParser = require('body-parser')

module.exports = function (express,app){
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json());
    
    require('./routes/routes')(app);

};





