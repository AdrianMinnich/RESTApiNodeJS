const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require("./api/routes/users");

mongoose.connect('mongodb://adsoon:' + process.env.MONGO_ATLAS_PW +'@liquor-store-shard-00-00-thysw.mongodb.net:27017,liquor-store-shard-00-01-thysw.mongodb.net:27017,liquor-store-shard-00-02-thysw.mongodb.net:27017/test?ssl=true&replicaSet=liquor-store-shard-0&authSource=admin&retryWrites=true',{
    useNewUrlParser: true})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false})); // simple bodies for URL encoded data
app.use(bodyParser.json());

//handling CORS (protecting API from unwanted access) - useless here (i'm using postman), able to send request from single page application
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', usersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404; // 404 - not found
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500); // 500 - internal server error (all other kinds of error)
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;