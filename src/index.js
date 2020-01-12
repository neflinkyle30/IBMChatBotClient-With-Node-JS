const express = require('express');
const app = express();
const config = require('./config');


app.listen(config.webPort, () => {
    console.log('Server Listen Port: ', config.webPort);
});
require('./app')(express, app);
