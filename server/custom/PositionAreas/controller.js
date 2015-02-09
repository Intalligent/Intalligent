var PositionAreas = connection.model('PositionAreas');
require('../../core/controller.js');
function PositionAreasController(model) {  
    this.model = model;
    this.searchFields = ['positionArea'];
}  
PositionAreasController.inherits(Controller);   
var controller = new PositionAreasController(PositionAreas);  
exports.PositionAreasFindAll = function(req,res){
     controller.findAll(req, function(result){ 
         res.send(201, result); 
     }); 
}; 
exports.PositionAreasFindOne = function(req,res){
    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.findOne(req, function(result){
        res.send(201, result);
    });
}; 
exports.PositionAreasCreate = function(req,res){  
    var data = req.body;

    if (typeof data.positionArea == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Position Area'is required"});
        return; 
    }  

    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";
    if (!data.nd_history) data.nd_history = [];

    data.nd_history.push({text:'Created on  '+ moment().format('MMMM Do YYYY, h:mm:ss a')+' by '+user,
          user_id : (req.isAuthenticated()) ? req.user.id : null, 
          user_name : (req.isAuthenticated()) ? req.user.username : null
          });

    controller.create(req, function(result){
        res.send(201, result);
    });
};   
exports.PositionAreasUpdate = function(req,res){ 
    var data = req.body;

    if (typeof data.positionArea == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Position Area'is required"});
        return; 
    }

    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.update(req, function(result){
        res.send(201, result);
    });
}; 
exports.PositionAreasDelete = function(req,res){  
    var data = req.body;

    controller.remove(req, function(result){
        res.send(201, result);
    });
};  
