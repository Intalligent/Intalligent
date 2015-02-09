var ActionPlans = connection.model('ActionPlans');

require('../../core/controller.js');

function ActionPlansController(model) {
    this.model = model;
    this.searchFields = ['actionPlanDescription'];
}

ActionPlansController.inherits(Controller);

var controller = new ActionPlansController(ActionPlans);

exports.ActionPlansFindAll = function(req,res){
    req.query.fields = '{"_id":1,"actionPlanDescription":1}';
    req.query.trash = true;

    controller.findAll(req, function(result){
        res.send(201, result);
    });
};

exports.ActionPlansFindAllByEmployee = function(req,res){
    var mandatoryFilters = [];

    req.query.trash = true;

    mandatoryFilters.push({employeeID: req.query.employeeID});

    if (req.query.trash == true) {
        mandatoryFilters.push({nd_trash_deleted: false});
    }

    var Employees = connection.model('Employees');
    var Positions = connection.model('Positions');
    var restrictRole = true;

    var roles = ['52988ac5df1fcbc201000008', '5327d7ef9c3b0f7801acda0d'];
    var userRoles = (typeof req.user.roles == 'string') ? [req.user.roles] : req.user.roles;

    for (var i in roles) {
        if (userRoles.indexOf(roles[i]) > -1){
            restrictRole = false;
            break;
        }
    }

    if (restrictRole) {
        var canManage = false;

        //Puesto del usuario conectado
        Employees.findOne({"employeeCode": req.user.username},{},{}, function(err, employee){
            if(err) throw err;

            if (employee) {
                if (employee.actualPosition && employee.actualPosition != '') {

                    Employees.findOne({"_id": req.query.employeeID},{},{}, function(err, employeeTo){
                        if(err) throw err;

                        Positions.findOne({"_id": employee.actualPosition},{},{}, function(err, position){
                            if(err) throw err;

                            if (position) {
                                if (!position.manageActionPlansToEverybody && position.manageActionPlansTo)
                                    if (position.manageActionPlansTo.indexOf(employeeTo.actualPosition) > -1){
                                        canManage = true;
                                    }

                                if (!position.manageActionPlansScopeEverybody) {
                                    switch (Number(position.manageActionPlansScope)) {
                                        case 1: //Department
                                            canManage = (employee.actualDepartment == employeeTo.actualDepartment);
                                            break;
                                        case 2: //Unit
                                            var units = generateUserFilterValue(req, 'idunit');

                                            canManage = (units.indexOf(employeeTo.idunit) > -1);
                                            break;
                                        case 3: //Brand
                                            var brands = generateUserFilterValue(req, 'idbrand');

                                            canManage = (brands.indexOf(employeeTo.idbrand) > -1);
                                    }
                                }

                                findAllActionPlans(res, req, mandatoryFilters, canManage);
                            }
                            else {
                                res.send(201, {result: 0, msg: 'Position of current user not found.'});
                            }
                        });
                    });
                }
                else {
                    res.send(201, {result: 0, msg: 'Current user do not have a position associated.'});
                }
            }
            else {
                res.send(201, {result: 0, msg: 'Current user do not have an employee associated.'});
            }
        });
    }
    else {
        findAllActionPlans(res, req, mandatoryFilters, true);
    }
};


function findAllActionPlans(res, req, mandatoryFilters, canManage) {
    var params = {}, sortField = {};

    if (req.query.orderBy) {
        sortField[req.query.orderBy] = 1;
    }
    else {
        sortField['actionPlanOrder'] = 1;
    }

    params['sort'] = sortField;

    ActionPlans.find({$and: mandatoryFilters}, {}, params, function(err, items){
        if(err) throw err;

        res.send(201, {result: 1, items: items, canManage: canManage});
    });
}


exports.ActionPlansFindIncompleteByEmployee = function(req,res){
    var mandatoryFilters = [];

    req.query.trash = true;

    mandatoryFilters.push({employeeID: req.query.employeeID});
    mandatoryFilters.push({status: {$ne: 3}});

    if (req.query.trash == true) {
        mandatoryFilters.push({nd_trash_deleted: false});
    }

    var Employees = connection.model('Employees');
    var Positions = connection.model('Positions');
    var restrictRole = true, canManage = false;

    var roles = ['52988ac5df1fcbc201000008', '5327d7ef9c3b0f7801acda0d'];
    var userRoles = (typeof req.user.roles == 'string') ? [req.user.roles] : req.user.roles;

    for (var i in roles) {
        if (userRoles && userRoles.indexOf(roles[i]) > -1){
            restrictRole = false;
            break;
        }
    }

    //Puesto del usuario conectado
    Employees.findOne({"employeeCode": req.user.username},{},{}, function(err, employee){
        if(err) throw err;

        if (employee || restrictRole) {
            if (employee) {
                if (employee.actualPosition && employee.actualPosition != '') {

                    Employees.findOne({"_id": req.query.employeeID},{},{}, function(err, employeeTo){
                        if(err) throw err;

                        Positions.findOne({"_id": employee.actualPosition},{},{}, function(err, position){
                            if(err) throw err;

                            if (position) {
                                if (position.manageActionPlansToEverybody)
                                    canManage = true;
                                else if (position.manageActionPlansTo && position.manageActionPlansTo.indexOf(employeeTo.actualPosition) > -1)
                                    canManage = true;

                                if (!position.manageActionPlansScopeEverybody) {
                                    canManage = false;

                                    if (typeof position.manageActionPlansScope == 'string') position.manageActionPlansScope = [position.manageActionPlansScope];

                                    var Users = connection.model('Users');

                                    Users.findOne({username: employeeTo.employeeCode},{}, function(err, user){
                                        for (var i in position.manageActionPlansScope) {
                                            if (canManage) break;

                                            switch (Number(position.manageActionPlansScope[i])) {
                                                case 1: //Department
                                                    canManage = (employee.actualDepartment == employeeTo.actualDepartment);
                                                    break;
                                                case 2: //Unit
                                                    var units = generateUserFilterValue(req, 'idunit');

                                                    canManage = (units.indexOf(employeeTo.idunit) > -1);
                                                    break;
                                                case 3: //Brand
                                                    var brands = generateUserFilterValue(req, 'idbrand');

                                                    canManage = false;

                                                    if (user) {
                                                        if (user.filters) {
                                                            for (var i in user.filters) {
                                                                if (String(user.filters[i].name).toLowerCase() == 'idbrand') {
                                                                    canManage = (brands.indexOf(user.filters[i].value) > -1);
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                            }
                                        }

                                        findActionPlans(res, mandatoryFilters, canManage);
                                    });
                                }
                                else {
                                    findActionPlans(res, mandatoryFilters, canManage);
                                }
                            }
                            else {
                                res.send(201, {result: 0, msg: 'Position of current user not found.'});
                            }
                        });
                    });
                }
                else {
                    res.send(201, {result: 0, msg: 'Current user do not have a position associated.'});
                }
            }
            else {
                res.send(201, {result: 0, msg: 'Current user do not have an employee associated.'});
            }
        }
        else {
            findActionPlans(res, mandatoryFilters, false);
        }
    });
};

function findActionPlans(res, mandatoryFilters, canManage) {
    ActionPlans.find({$and: mandatoryFilters}, {}, {}, function(err, actionPlans){
        if(err) throw err;

        var percentCompleted = 0;

        for (var i in actionPlans) {
            percentCompleted += actionPlans[i].percentCompleted;
        }

        if (actionPlans.length > 0)
            percentCompleted = Math.round(percentCompleted/actionPlans.length);

        ActionPlans.find({$and: mandatoryFilters}, {}, {sort: {actionPlanOrder: 1}, limit: 5}, function(err, items){ //{sort: {startDate: -1}, limit: 5}
            if(err) throw err;

            res.send(201, {result: 1, items: items, percentCompleted: percentCompleted, canManage: canManage});
        });
    });
}

exports.ActionPlansFindOne = function(req,res){
    req.query.trash = true;

    controller.findOne(req, function(result){
        var Employees = connection.model('Employees');

        Employees.find({_id: {$in: result.item.trainers}}, {employeeName: 1}, {}, function(err, employees) {
            if (err) throw err;

            var trainers = [];

            for (var i in employees) {
                trainers.push(employees[i].employeeName);
            }

            result.item.trainers = trainers;

            res.send(201, result);
        });
    });
};

exports.ActionPlansCreate = function(req,res){
    req.query.trash = true;

    req.body.sourceType = 'MANUAL';

    controller.create(req, function(result){
        res.send(201, result);
    });
};

exports.ActionPlansUpdate = function(req,res){
    req.query.trash = true;

    req.body.revisionDate = new Date();

    if (req.body.status == 3 || req.body.status == '3')
        req.body.endDate = new Date();

    controller.update(req, function(result){
        res.send(201, result);
    })
};

exports.ActionPlansDelete = function(req,res){
    var data = req.body;

    req.query.trash = true;

    data._id = data.id;
    data.nd_trash_deleted = true;
    data.nd_trash_deleted_date = new Date();

    req.body = data;

    controller.update(req, function(result){
        res.send(201, result);
    });
};