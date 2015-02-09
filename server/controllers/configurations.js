//var Configurations = require('../models/configurations');
var Configurations = connection.model('Configurations');

/* CONFIGURATIONS */

exports.adminFindUserFilters = function(req,res){
    Configurations.adminFindUserFilters(function(result){
        res.send(201, result);
    });
};

exports.adminGetConfigurations = function(req,res){
    Configurations.adminGetConfigurations(function(result){
        res.send(201, result);
    });
};

exports.adminSaveConfigurations = function(req,res){
    Configurations.adminSaveConfigurations(req.body, function(result){
        res.send(201, result);
    });
};