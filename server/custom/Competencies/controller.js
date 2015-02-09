var Competencies = connection.model('Competencies');
require('../../core/controller.js');
function CompetenciesController(model) {  
this.model = model;  
this.searchFields = ['competency'];
}  
CompetenciesController.inherits(Controller);   
var controller = new CompetenciesController(Competencies);  
exports.CompetenciesFindAll = function(req,res){
     controller.findAll(req, function(result){ 
         res.send(201, result); 
     }); 
}; 
exports.CompetenciesFindOne = function(req,res){
    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.findOne(req, function(result){
        res.send(201, result);
    });
}; 
exports.CompetenciesCreate = function(req,res){  
    var data = req.body;

    if (typeof data.competency == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Competency'is required"}); 
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
exports.CompetenciesUpdate = function(req,res){ 
    var data = req.body;

    if (typeof data.competency == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Competency'is required"}); 
        return; 
    }

    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.update(req, function(result){
        res.send(201, result);
    });
}; 
exports.CompetenciesDelete = function(req,res){  
    var data = req.body;

    controller.remove(req, function(result){
        res.send(201, result);
    });
};  
