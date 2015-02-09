//var Logs = require('../models/logs');
var Logs = connection.model('Logs');

/* LOGS */
exports.logsSaveToLog = function(req,res){
    Logs.saveToLog(req, req.body, function(result){
        res.send(201, result);
    });
};

exports.adminLogsFindAll = function(req,res){
    Logs.adminFindAll(req, function(result){
        res.send(201, result);
    });
};