var Units = connection.model('Units');
require('../../core/controller.js');
function UnitsController(model) {  
this.model = model;  
this.searchFields = ['unit'];
}  
UnitsController.inherits(Controller);   
var controller = new UnitsController(Units);  
exports.UnitsFindAll = function(req,res){
     controller.findAll(req, function(result){ 
         res.send(201, result); 
     }); 
}; 
exports.UnitsFindOne = function(req,res){
    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.findOne(req, function(result){
        res.send(201, result);
    });
}; 
exports.UnitsCreate = function(req,res){  
    var data = req.body;

    if (typeof data.unit == 'undefined'  || !data.brand ) {
        res.send(201, {result: 0, msg: "'Unit' ,'Brand'are required"}); 
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
exports.UnitsUpdate = function(req,res){ 
    var data = req.body;

    if (typeof data.unit == 'undefined'  || !data.brand ) {
        res.send(201, {result: 0, msg: "'Unit' ,'Brand'are required"}); 
        return; 
    }

    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.update(req, function(result){
        res.send(201, result);
    });
}; 
exports.UnitsDelete = function(req,res){  
    var data = req.body;

    controller.remove(req, function(result){
        res.send(201, result);
    });
};  
