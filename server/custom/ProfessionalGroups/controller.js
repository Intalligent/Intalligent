var ProfessionalGroups = connection.model('ProfessionalGroups');
require('../../core/controller.js');
function ProfessionalGroupsController(model) {  
this.model = model;  
this.searchFields = ['professionalGroup'];
}  
ProfessionalGroupsController.inherits(Controller);   
var controller = new ProfessionalGroupsController(ProfessionalGroups);  
exports.ProfessionalGroupsFindAll = function(req,res){
    controller.findAll(req, function(result){
        res.send(201, result);
    });
}; 
exports.ProfessionalGroupsFindOne = function(req,res){ 
    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.findOne(req, function(result){
        res.send(201, result);
    });
}; 
exports.ProfessionalGroupsCreate = function(req,res){  
    var data = req.body;

    if (typeof data.professionalGroup == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Professional Group'is required"}); 
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
exports.ProfessionalGroupsUpdate = function(req,res){ 
    var data = req.body;

    if (typeof data.professionalGroup == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Professional Group'is required"}); 
        return; 
    }

    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

     controller.update(req, function(result){ 
         res.send(201, result); 
     }); 
}; 
exports.ProfessionalGroupsDelete = function(req,res){  
    var data = req.body;

    controller.remove(req, function(result){
        res.send(201, result);
    });
};  
