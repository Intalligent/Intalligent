//var Files = require('../models/files');
var Files = connection.model('Files');

/* FILES */
exports.filesGetFiles = function(req,res){
    Files.getFiles(req, function(result){
        res.send(201, result);
    });
};

exports.filesUpload = function(req,res){
    Files.upload(req, function(result){
        res.send(200, result);
    });
};

exports.adminFilesFindAll = function(req,res){
    Files.adminFindAll(req, function(result){
        res.send(201, result);
    });
};

exports.adminFilesFindOne = function(req,res){
    Files.adminFindOne(req, function(result){
        res.send(201, result);
    });
};

exports.adminFilesUpload = function(req,res){
    Files.adminUpload(req, function(result){
        res.send(200, result);
    });
};

exports.adminFilesUpdate = function(req,res){
    Files.adminEdit(req, function(result){
        res.send(201, result);
    });
};

exports.adminFilesDelete = function(req,res){
    Files.adminDelete(req, function(result){
        res.send(201, result);
    });
};