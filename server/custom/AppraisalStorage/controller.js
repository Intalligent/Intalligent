var AppraisalStorage = connection.model('AppraisalStorage');
require('../../core/controller.js');
function AppraisalStorageController(model) {  
this.model = model;  
this.searchFields = ['appraisalToEmployeeName', 'appraisalByEmployeeName'];
}  
AppraisalStorageController.inherits(Controller);   
var controller = new AppraisalStorageController(AppraisalStorage);  
exports.AppraisalStorageFindAll = function(req,res){
    req.query.find = [];

    req.query.sort = 'appraisalDate';
    req.query.sortType = -1;

    if (req.query.type && req.query.employee) {
        if (req.query.type == 'by')
            req.query.find.push({appraisalByEmployee: req.query.employee});
        if (req.query.type == 'to')
            req.query.find.push({appraisalToEmployee: req.query.employee});
    }
    if (req.query.status) {
        req.query.find.push({appraisalStatus: req.query.status});
    }

     controller.findAll(req, function(result){ 
         res.send(201, result); 
     }); 
};
exports.AppraisalStorageFindAllByEmployee = function(req,res){
    if (!req.query.status || !req.query.type || !req.query.employee) {
        res.send(201, {result: 0, msg: "Missing required fields."});
        return;
    }

    var find = {appraisalStatus: req.query.status};
    var params = {sort: {appraisalEndDate: -1}};

    if (!req.query.limit || (req.query.limit && req.query.limit != 'all'))
        params['limit'] = 5;

    if (req.query.type == 'byEmployee') find['appraisalByEmployee'] = req.query.employee;
    else find['appraisalToEmployee'] = req.query.employee;

    AppraisalStorage.find(find,{},params,function(err, items){
        res.send(201, {result: 1, items: items});
    });
};

exports.AppraisalStorageFindOne = function(req,res){
    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    controller.findOne(req, function(result){
        res.send(201, result);
    });
};

exports.AppraisalStorageFindOneByEmployee = function(req,res){
    if (!req.query.status || !req.query.toEmployee || !req.query.byEmployee) {
        res.send(201, {result: 0, msg: "Missing required fields."});
        return;
    }

    AppraisalStorage.findOne({appraisalStatus: req.query.status, appraisalToEmployee: req.query.toEmployee, appraisalByEmployee: req.query.byEmployee},{},function(err, item){
        if (!item) {
            res.send(201, {result: 0, msg: "Item not found."});
        }
        else {
            res.send(201, {result: 1, item: item.toObject()});
        }
    });
};

exports.AppraisalStorageCreate = function(req,res){  
    var data = req.body;

    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";
    if (!data.nd_history) data.nd_history = [];

    data.nd_history.push({text:'Created on  '+ moment().format('MMMM Do YYYY, h:mm:ss a')+' by '+user,
          user_id : (req.isAuthenticated()) ? req.user.id : null, 
          user_name : (req.isAuthenticated()) ? req.user.username : null
          });
    if (data.appraisalStatus == 2) {
        var Ratings = connection.model('Ratings');

        Ratings.calculateRating(req, data, function(appraisalStorage) {
            req.body = appraisalStorage;

            controller.create(req, function(result){
                res.send(201, result);
            });
        });
    }
    else {
        controller.create(req, function(result){
            res.send(201, result);
        });
    }
};   
exports.AppraisalStorageUpdate = function(req,res){ 
    var data = req.body;

    var user = (req.isAuthenticated()) ? req.user.username : "unsigned user";

    if (data.appraisalStatus == 2) {
        var Ratings = connection.model('Ratings');

        Ratings.calculateRating(req, data, function(appraisalStorage) {
            req.body = appraisalStorage;

            controller.update(req, function(result){
                res.send(201, result);
            });
        });
    }
    else {
        controller.update(req, function(result){
            res.send(201, result);
        });
    }
}; 
exports.AppraisalStorageDelete = function(req,res){  
    var data = req.body;

    controller.remove(req, function(result){
        res.send(201, result);
    });
};

exports.AppraisalStorageGetBehaviourHistory = function(req,res){
    if (!req.query.employee || !req.query.employeeFrom || !req.query.behaviour) {
        res.send(201, {result: 0, msg: "Missing required fields."});
        return;
    }

    var find = {appraisalStatus: 2, appraisalToEmployee: req.query.employee, appraisalByEmployee: req.query.employeeFrom};
    var params = {sort: {appraisalEndDate: -1}};

    if (!req.query.limit || (req.query.limit && req.query.limit != 'all'))
        params['limit'] = 5;

    AppraisalStorage.find(find,{},params,function(err, items){
        var behaviours = [];

        for (var i in items) {
            var appraisalStorage = items[i];

            for (var a in appraisalStorage.areasOverview) {
                var areasOverview = appraisalStorage.areasOverview[a];

                for (var b in areasOverview.behaviours) {
                    var behaviour = areasOverview.behaviours[b];

                    if (behaviour.behaviourID == req.query.behaviour) {
                        behaviour['appraisalEndDate'] = appraisalStorage.appraisalEndDate;

                        behaviours.push(behaviour);
                    }
                }
            }
        }

        res.send(201, {result: 1, items: behaviours});
    });
};

exports.AppraisalStorageGetLastEvaluation = function(req,res){
    if (!req.query.employee) {
        res.send(201, {result: 0, msg: "Missing required fields."});
        return;
    }

    var Employees = connection.model('Employees');
    var Positions = connection.model('Positions');

    Employees.findOne({"_id" : req.query.employee},{},function(err, employee){
        if(err) throw err;

        if (employee && employee.actualPosition && employee.actualPosition != '') {
            Positions.findOne({"_id" : employee.actualPosition},{},function(err, position){
                if(err) throw err;

                if (position && position.status == 1 && position.draft == false) {
                    var areas = [];

                    AppraisalStorage.findOne({appraisalStatus: 2, appraisalToEmployee: employee._id},{},
                        {sort: {appraisalEndDate: -1}}, function(err, storage){
                            if(err) throw err;

                            if (storage)
                            for (var i in position.areas) {
                                for (var s in storage.areasOverview) {
                                    if (position.areas[i].status == 1 && position.areas[i].draft == false && storage.areasOverview[s].areaID == position.areas[i]._id) {
                                        areas.push(storage.areasOverview[s]);
                                        break;
                                    }
                                }
                            }

                            res.send(201, {result: 1, items: areas});
                        });
                }
                else {
                    res.send(201, {result: 0, msg: "Invalid position."});
                }
            });
        }
        else {
            res.send(201, {result: 0, msg: "Invalid employee."});
        }
    });
};


