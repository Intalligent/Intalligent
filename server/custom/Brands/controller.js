var Brands = connection.model('Brands');
require('../../core/controller.js');
function BrandsController(model) {  
this.model = model;  
this.searchFields = ['brand'];
}  
BrandsController.inherits(Controller);   
var controller = new BrandsController(Brands);  
exports.BrandsFindAll = function(req,res){
     controller.findAll(req, function(result){ 
         res.send(201, result); 
     }); 
}; 
exports.BrandsFindOne = function(req,res){
    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.findOne(req, function(result){
        res.send(201, result);
    });
}; 
exports.BrandsCreate = function(req,res){  
    var data = req.body;

    if (typeof data.brand == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Brand'is required"}); 
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
exports.BrandsUpdate = function(req,res){ 
    var data = req.body;

    if (typeof data.brand == 'undefined' ) {
        res.send(201, {result: 0, msg: "'Brand' is required"});
        return; 
    }

    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.update(req, function(result){
        res.send(201, result);
    });
}; 
exports.BrandsDelete = function(req,res){  
    var data = req.body;

    controller.remove(req, function(result){
        res.send(201, result);
    });
};  
