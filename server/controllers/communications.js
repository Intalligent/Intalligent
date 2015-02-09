var Communications = connection.model('Communications');

/* COMMUNICATIONS */

require('../core/controller.js');

function CommunicationsController(model) {
    this.model = model;
    this.searchFields = ['name', 'description'];
}

CommunicationsController.inherits(Controller);

var controller = new CommunicationsController(Communications);

exports.adminCommunicationsFindAll = function(req,res){
    controller.findAll(req, function(result){
        res.send(201, result);
    });
};

exports.adminCommunicationsFindOne = function(req,res){
    controller.findOne(req, function(result){
        res.send(201, result);
    });
};