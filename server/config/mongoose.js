module.exports = function (mongoose) {
    //var mongoose = require('mongoose');
    var dbURI = config.db;
    global.connection = mongoose.createConnection(dbURI,{ server: { poolSize: 5 } });

    // CONNECTION EVENTS
    // When successfully connected
    connection.on('connected', function () {
        console.log('Mongoose connection open to ' + dbURI);
    });

    // If the connection throws an error
    connection.on('error',function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    var fs = require('fs');
    var models_dir = __dirname + '/../models';
    fs.readdirSync(models_dir).forEach(function (file) {
        if(file[0] === '.') return;
        require(models_dir+'/'+ file);
    });

    //Custom models
    var models_dir = __dirname + '/../custom';
    fs.readdirSync(models_dir).forEach(function (file) {
        if(file[0] === '.') return;
        require(models_dir+'/'+ file+'/model.js');
    });
}