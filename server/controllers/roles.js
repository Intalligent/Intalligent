//var Roles = require('../models/roles');
var Roles = connection.model('Roles');

/* ROLES */

require('../core/controller.js');

function RolesController(model) {
    this.model = model;
    this.searchFields = ['name'];
}

RolesController.inherits(Controller);

var controller = new RolesController(Roles);

exports.adminRolesFindAll = function(req,res){
    controller.findAll(req, function(result){
        res.send(201, result);
    });
};

exports.adminRolesFindOne = function(req,res){
    controller.findOne(req, function(result){
        res.send(201, result);
    });
};