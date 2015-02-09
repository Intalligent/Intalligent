var Departments = connection.model('Departments');
require('../../core/controller.js');
function DepartmentsController(model) {  
this.model = model;  
this.searchFields = ['department'];
}  
DepartmentsController.inherits(Controller);   
var controller = new DepartmentsController(Departments);  
exports.DepartmentsFindAll = function(req,res){
     controller.findAll(req, function(result){ 
         res.send(201, result); 
     }); 
}; 
exports.DepartmentsFindOne = function(req,res){
    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

     controller.findOne(req, function(result){ 
         res.send(201, result);  
     }); 
}; 
exports.DepartmentsCreate = function(req,res){  
    var data = req.body;

    if (typeof data.department == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Department'is required"}); 
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
exports.DepartmentsUpdate = function(req,res){ 
    var data = req.body;

    if (typeof data.department == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Department'is required"}); 
        return; 
    }

    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.update(req, function(result){
        res.send(201, result);
    });
}; 
exports.DepartmentsDelete = function(req,res){  
    var data = req.body;

    controller.remove(req, function(result){
        res.send(201, result);
    });
};  
