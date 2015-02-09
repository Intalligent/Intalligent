var Employees = connection.model('Employees');

require('../../core/controller.js');

function EmployeesController(model) {
    this.model = model;
    this.searchFields = ['employeeCode', 'employeeName'];
}

EmployeesController.inherits(Controller);

var controller = new EmployeesController(Employees);

exports.EmployeesFindAll = function(req,res){
    req.query.fields = '{"_id":1,"employeeCode":1,"employeeName":1,"employeeImage":1,"actualPosition":1,"actualPositionName":1,"idunit":1,"status":1,"numberOfEvaluations":1,"topPerformerRating":1,"topPerformerRatingEvolution":1}';
    req.query.trash = true;

    var Positions = connection.model('Positions');
    var Units = connection.model('Units');
    var positionsFilter = null, employeeFilter = null;
    var restrictRole = true;

    var roles = ['52988ac5df1fcbc201000008', '5327d7ef9c3b0f7801acda0d'];
    var userRoles = (typeof req.user.roles == 'string') ? [req.user.roles] : req.user.roles;

    for (var i in roles) {
        if (userRoles && userRoles.indexOf(roles[i]) > -1){
            restrictRole = false;
            break;
        }
    }

    if (req.query.position)
        positionsFilter = {"actualPosition": req.query.position};

    //Puesto del usuario conectado
    Employees.findOne({"employeeCode": req.user.username},{},{}, function(err, employee){
        if(err) throw err;

        Positions.findOne({"_id": (employee && employee.actualPosition && employee.actualPosition != '') ? employee.actualPosition: undefined},{},{}, function(err, position){
            if(err) throw err;

            if (restrictRole) {
                if (employee) {
                    if (position) {
                        if (!req.query.position && !position.canViewEverybody && position.canView)
                            positionsFilter = {"actualPosition": { "$in": position.canView}};

                        if (!position.canViewScopeEverybody) {
                            employeeFilter = {};

                            var brands = generateUserFilterValue(req, 'idbrand');

                            Units.find({brand: {"$in": brands}},{},{}, function(err, items){
                                if(err) throw err;

                                if (typeof position.canViewScope == 'string') position.canViewScope = [position.canViewScope];

                                for (var i in position.canViewScope) {
                                    switch (Number(position.canViewScope[i])) {
                                        case 1: //Department
                                            employeeFilter['actualDepartment'] = employee.actualDepartment;
                                            break;
                                        case 2: //Unit
                                            var units = generateUserFilterValue(req, 'idunit');

                                            employeeFilter['idunit'] = { "$in": units};
                                            break;
                                        case 3: //Brand
                                            //var brands = generateUserFilterValue(req, 'idbrand');

                                            var units = [];

                                            for (var i in items) {
                                                units.push(items[i].unit);
                                            }

                                            employeeFilter['idunit'] = { "$in": units};
                                    }
                                }

                                employeesFindAll(req, res, position, employee, positionsFilter, employeeFilter);
                            });
                        }
                        else {
                            employeesFindAll(req, res, position, employee, positionsFilter, employeeFilter);
                        }
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
                employeesFindAll(req, res, position, employee, positionsFilter, employeeFilter);
            }
        });
    });
};

function employeesFindAll(req, res, position, employee, positionsFilter, employeeFilter, positionsToFilter) {
    var perPage = config.pagination.itemsPerPage, page = (req.query.page) ? req.query.page : false;
    var find = {}, searchText = (req.query.search) ? req.query.search : false;
    var orderBy = (req.query.orderBy) ? req.query.orderBy : false;
    var filters = (req.query.filters) ? req.query.filters : false;
    var fieldsToGet = {},  fieldsToGetText = (req.query.fields) ? req.query.fields : false;

    //Necesario para filtro por "evaluable"
    if (filters && positionsToFilter == null) {
        if (typeof filters == 'string') filters = [filters];

        for (var i in filters) {
            var thisFilter = JSON.parse(filters[i]);

            if (thisFilter && thisFilter.field && thisFilter.field.name == 'evaluable' && position && employee) {
                var Positions = connection.model('Positions');

                Positions.find({draft: false, status: 1},{_id: 1},{}, function(err, positions) {
                    if (err) throw err;

                    employeesFindAll(req, res, position, employee, positionsFilter, employeeFilter, positions);
                });

                return;
            }
        }
    }

    var params = (page) ? {skip: (page-1)*perPage, limit: perPage} : {};

    if (fieldsToGetText) {
        fieldsToGet = JSON.parse(fieldsToGetText);
    }

    var mandatoryFilters = [];

    if (req.query.trash == true)
    {
        var trashField = {}
        trashField['nd_trash_deleted'] = false;

        mandatoryFilters.push(trashField);
    }

    if (req.query.userid == true)
    {
        var userField = {}
        userField[user_id] = req.user._id;

        mandatoryFilters.push(userField);
    }

    var searchFind = {}

    if (searchText) {
        var findFields = [];
        var searchFields = ['employeeCode', 'employeeName'];

        for (var i in searchFields) {
            var thisField = {};

            //thisField[searchFields[i]] = {$regex : searchText};
            thisField[searchFields[i]] = new RegExp(searchText, "i"); //"i" is for case-insensitive

            findFields.push(thisField);
        }
        searchFind =  {$or: findFields};
    }

    if (filters) {
        if (typeof filters == 'string') filters = [filters];

        for (var i in filters) {
            var thisField = {}, thisFilter = JSON.parse(filters[i]);

            if (thisFilter && thisFilter.field && thisFilter.field.name == 'evaluable' && position && employee) {
                var positions = [];

                for (var i in positionsToFilter) {
                    positions.push(positionsToFilter[i]._id);
                }

                thisField['actualPosition'] = {$in: positions};
                thisField['status'] = 'Active';

                if (!position.assessmentToEverybody) {
                    thisField['actualPosition'] = {$in: position.assessmentTo};
                }

                if (!position.assessmentScopeEverybody) {
                    switch (position.assessmentScope) {
                        case 1: //Department
                            thisField['actualDepartment'] = employee.actualDepartment;
                            break;
                        case 2: //Unit
                            var units = generateUserFilterValue(req, 'idunit');

                            thisField['idunit'] = {$in: units};
                            break;
                        case 3: //Brand
                            var brands = generateUserFilterValue(req, 'idbrand');

                            thisField['idbrand'] = {$in: brands};
                    }
                }
            }
            else {
                switch (thisFilter.condition) {
                    case 'equals': thisField[thisFilter.field.name] = thisFilter.value;
                        break;
                    case 'notEquals': thisField[thisFilter.field.name] = {$ne: thisFilter.value};
                        break;
                    case 'contains': thisField[thisFilter.field.name] = new RegExp(thisFilter.value, "i");
                        break;
                    case 'greaterThan': thisField[thisFilter.field.name] = {$gte: thisFilter.value};
                        break;
                    case 'lowerThan': thisField[thisFilter.field.name] = {$lt: thisFilter.value};
                }
            }

            mandatoryFilters.push(thisField);
        }
    }

    if (orderBy) {
        var sort = {};

        sort[orderBy] = (orderBy == 'topPerformerRating') ? -1 : 1;

        params['sort'] = sort;
    }

    if (searchFind != {})
        mandatoryFilters.push(searchFind);

    if (positionsFilter)
        mandatoryFilters.push(positionsFilter);

    if (employeeFilter)
        mandatoryFilters.push(employeeFilter);

    mandatoryFilters.push({status: 'Active'});

    if (mandatoryFilters != [])
        find =  {$and: mandatoryFilters};

    Employees.find(find,fieldsToGet,params, function(err, items){
        if(err) throw err;

        //En principio los pongo todos como no evaluables
        for (var i in items) {
            items[i] = items[i].toObject();
            items[i]['evaluable'] = false;
        }

        Employees.count(find, function (err, count) {
            var Positions = connection.model('Positions');

            Positions.find({},{"_id":1,"draft":1,"status":1,"positionName":1,"assessmentToEverybody":1,"assessmentTo":1,"assessmentScopeEverybody":1,"assessmentScope":1},{}, function(err, positions){
                var currentUserPosition = null;

                Employees.findOne({"employeeCode": req.user.username},{},{}, function(err, employee){
                    if(err) throw err;

                    if (employee) {
                        var currentUserPosition = null;

                        //Puesto del usuario conectado
                        for (var i in positions) {
                            if (positions[i]._id == employee.actualPosition) {
                                currentUserPosition = positions[i];
                                break;
                            }
                        }

                        if (currentUserPosition) {
                            for (var i in items) {
                                for (var j in positions) {
                                    if (items[i].actualPosition == positions[j]._id) {
                                        items[i]['evaluable'] = checkIfEvaluable(req, currentUserPosition, positions[j], employee, items[i]);
                                    }
                                }
                            }

                            res.send(201, {result: 1, page: page, pages: Math.ceil(count/perPage), items: items});
                        }
                        else {
                            res.send(201, {result: 1, page: page, pages: Math.ceil(count/perPage), items: items});
                        }
                    }
                    else {
                        res.send(201, {result: 1, page: page, pages: Math.ceil(count/perPage), items: items});
                    }
                });
            });
        });
    });
}

function checkIfEvaluable(req, positionFrom, positionTo, employeeFrom, employeeTo) {
    var result = false;

    if (positionFrom && positionTo && positionTo.draft == false && positionTo.status == 1 && employeeTo.status == 'Active') {
        if (positionFrom.assessmentToEverybody) {
            result = true;
        }
        else if (positionFrom.assessmentTo.indexOf(positionTo._id) > -1){
            result = true;
        }

        if (result) {
            if (!positionFrom.assessmentScopeEverybody) {
                switch (positionFrom.assessmentScope) {
                    case 1: //Department
                        result = (employeeFrom.actualDepartment == employeeTo.actualDepartment);
                        break;
                    case 2: //Unit
                        var units = generateUserFilterValue(req, 'idunit');

                        //result = (employeeFrom.idunit == employeeTo.idunit);
                        result = (units.indexOf(employeeTo.idunit) > -1);
                        break;
                    case 3: //Brand
                        var brands = generateUserFilterValue(req, 'idbrand');

                        result = (brands.indexOf(employeeTo.idbrand) > -1);
                }
            }
        }
    }

    return result;
}

exports.EmployeesFindOne = function(req,res){
    req.query.trash = true;

    if (!req.query.id) {
        res.send(201, {result: 0, msg: "'id' is required."});
        return;
    }

    var Positions = connection.model('Positions');
    var find = generateFindFields(req, req.query.id);

    Employees.findOne(find,{},function(err, item){
        if (!item) {
            res.send(201, {result: 0, msg: "Item not found."});
        }
        else {
            item = item.toObject();

            item['evaluable'] = false;

            var findPosition = (item.actualPosition && item.actualPosition != '') ? {"_id": item.actualPosition} : {"_id": undefined};

            Positions.findOne(findPosition,{},{}, function(err, position){
                if(err) throw err;

                //Empleado del usuario conectado
                Employees.findOne({"employeeCode": req.user.username},{},{}, function(err, employee){
                    if(err) throw err;

                    if (employee && employee.actualPosition && employee.actualPosition != '') {
                        //Puesto del usuario conectado
                        Positions.findOne({"_id": employee.actualPosition},{},{}, function(err, position){
                            if(err) throw err;

                            if (position && item.actualPosition && item.actualPosition != '') {
                                //Puesto del usuario a evaluar
                                Positions.findOne({"_id": item.actualPosition},{},{}, function(err, evalPosition){
                                    if(err) throw err;

                                    if (evalPosition) {
                                        item['evaluable'] = checkIfEvaluable(req, position, evalPosition, employee, item);
                                    }

                                    res.send(201, {result: 1, item: item});
                                });
                            }
                            else {
                                res.send(201, {result: 1, item: item});
                            }
                        });
                    }
                    else {
                        res.send(201, {result: 1, item: item});
                    }
                });
            });
        }
    });
    /*controller.findOne(req, function(result){
        res.send(201, result);
    });*/
};

exports.EmployeesCreate = function(req,res){
    var data = req.body;
    var Positions = connection.model('Positions');

    req.query.trash = true;

    if (!Employees.validateEmployee(data)) {
        res.send(201,{result: 0, msg: "Missing required fields."});

        return;
    }

    Positions.findOne({"_id": data.actualPosition},{},{}, function(err, position){
        if(err) throw err;

        if (position) {
            data.actualPositionName = position.positionName;
        }

        req.body = data;

        controller.create(req, function(result){
            res.send(201, result);
        });
    });
};

exports.EmployeesUpdate = function(req,res){
    var data = req.body, id = data._id;
    var Positions = connection.model('Positions');

    req.query.trash = true;

    if (!Employees.validateEmployee(data)) {
        res.send(201,{result: 0, msg: "Missing required fields."});

        return;
    }

    delete(data.id);
    delete(data._id);

    if (data.actualPosition && data.actualPosition != '') {
        Positions.findOne({"_id": data.actualPosition},{},{}, function(err, position){
            if(err) throw err;

            if (position) {
                data.actualPositionName = position.positionName;
            }

            req.body = data;

            Employees.update({
                "_id" : id
            }, {
                $set: data
            }, function (err, numAffected) {
                if(err) throw err;

                res.send(201,{result: 1, msg: numAffected+" items updated."});
            });
        });
    }
    else {
        req.body = data;

        Employees.update({
            "_id" : id
        }, {
            $set: data
        }, function (err, numAffected) {
            if(err) throw err;

            res.send(201,{result: 1, msg: numAffected+" items updated."});
        });
    }
};

exports.EmployeesDelete = function(req,res){
    var data = req.body;

    console.log(data);

    req.query.trash = true;

    data.nd_trash_deleted = true;
    data.nd_trash_deleted_date = new Date();

    controller.update(req, function(result){
        if (data.deleteUser) {
            var Users = connection.model('Users');

            Employees.findOne({"_id": data._id},{},{}, function(err, employee){
                if(err) throw err;

                Users.remove({
                    "username" : employee.employeeCode
                }, function (err, numAffected) {
                    if(err) throw err;

                    res.send(201, result);
                });
            });
        }
        else {
            res.send(201, result);
        }
    });

    /*controller.remove(req, function(result){
        res.send(201, result);
    });*/
};

exports.EmployeesReset = function(req,res){
    var data = req.body, roles = ['52988ac5df1fcbc201000008', '5327d7ef9c3b0f7801acda0d'], restrictRole = true;
    var userRoles = (typeof req.user.roles == 'string') ? [req.user.roles] : req.user.roles;

    for (var i in roles) {
        if (userRoles.indexOf(roles[i]) > -1){
            restrictRole = false;
            break;
        }
    }

    if (restrictRole) {
        res.send(201,{result: 0, msg: "Invalid user permits."});
        return;
    }

    var AppraisalStorage = connection.model('AppraisalStorage');
    var AutoAppraisalStorage = connection.model('AutoAppraisalStorage');
    var AnalyticsMeasureLevel = connection.model('AnalyticsMeasureLevel');
    var AnalyticsMeasureLevelAutoAssesment = connection.model('AnalyticsMeasureLevelAutoAssesment');
    var ActionPlans = connection.model('ActionPlans');

    Employees.update({
        "_id" : data.id
    }, {
        $unset: {
            numberOfEvaluations: 1,
            lastEvaluationDate: 1,
            numberOfPersonalityAppraisals: 1,
            lastPersonalityAppraisalDate: 1,
            topPerformerRating: 1,
            topPerformerRatingEvolution: 1,
            topPerformerFork: 1,
            topPerformerForkDescription: 1,
            topPerformerRatingDate: 1,
            topPerformerAutoRating: 1,
            topPerformerAutoRatingEvolution: 1,
            topPerformerAutoFork: 1,
            topPerformerAutoForkDescription: 1,
            topPerformerAutoRatingDate: 1,
            topPerformerPersonalityRating: 1,
            topPerformerPersonalityRatingEvolution: 1,
            topPerformerPersonalityFork: 1,
            topPerformerPersonalityForkDescription: 1,
            topPerformerPersonalityRatingDate: 1
        }
    }, function (err, numAffected) {
        if(err) throw err;

        AppraisalStorage.remove({appraisalToEmployee: data.id}, function (err, numAffected) {
            if(err) throw err;

            AutoAppraisalStorage.remove({appraisalToEmployee: data.id}, function (err, numAffected) {
                if(err) throw err;

                AnalyticsMeasureLevel.remove({levelID: data.id}, function (err, numAffected) {
                    if(err) throw err;

                    AnalyticsMeasureLevelAutoAssesment.remove({levelID: data.id}, function (err, numAffected) {
                        if(err) throw err;

                        ActionPlans.remove({employeeID: data.id}, function (err, numAffected) {
                            if(err) throw err;

                            res.send(201,{result: 0, msg: "Employee evaluations data has been reset."});
                        });
                    });
                });
            });
        });
    });
};

exports.EmployeesGetProfile = function(req,res){
    Employees.findOne({"employeeCode": req.user.username},{},{}, function(err, employee){
        if(err) throw err;

        if (employee) {
            employee = employee.toObject();

            //employee['actualPositionName'] = null;
            employee['evaluable'] = false;
            employee['personalityEvaluable'] = false;

            var Positions = connection.model('Positions');
            var Units = connection.model('Units');
            var Brands = connection.model('Brands');

            var findPosition = (employee.actualPosition && employee.actualPosition != '') ? {"_id": employee.actualPosition} : {"_id": undefined};
            var findUnit = (employee.idunit && employee.idunit != '') ? {"unit": employee.idunit} : {"_id": undefined};

            findPosition['nd_trash_deleted'] = false;

            Positions.findOne(findPosition,{},{}, function(err, position){
                if(err) throw err;

                if (position) {
                    //employee['actualPositionName'] = position.positionName;
                    employee['evaluable'] = (position.autoAssessment && position.status == 1 && position.draft == false && employee.status == 'Active');
                    employee['personalityEvaluable'] = (position.personalityAssessment && employee.status == 'Active');
                }

                Units.findOne(findUnit,{},{}, function(err, unit){
                    if(err) throw err;

                    var brand = generateUserFilterValue(req, 'idbrand');

                    var findBrand = (brand && brand.length > 0) ? {"code": brand[0]} : {"_id": undefined};

                    Brands.findOne(findBrand,{},{}, function(err, brand){
                        if(err) throw err;

                        var result = {result: 1, employee: employee};

                        result['unit'] = (unit) ? unit : null;
                        result['brand'] = (brand) ? brand : null;

                        res.send(201, result);
                    });
                });
            });
        }
        else {
            res.send(201, {result: 0, msg: 'Employee not found'});
        }
    });
};

exports.filesUpload = function(req,res){
    Employees.upload(req, function(result){
        res.send(200, result);
    });
};

exports.EmployeesGetFieldValues = function(req,res){
    var data = req.query, group = {}, sort = {};

    group[data.fieldID] = '$'+data.fieldID;
    sort[data.fieldID] = 1;

    Employees.aggregate([
        { $group: { _id: group } },
        { $sort: sort }
    ],
        function(err, result) {
            var items = [];

            for (var i in result) {
                if (result[i]._id[data.fieldID]) {
                    items.push(result[i]._id[data.fieldID]);
                }
            }

            res.send(201, {result: 1, items: items});
        }
    );
};

function generateFindFields(req, id)
{
    var mandatoryFilters = [];
    var idField = {}
    idField['_id'] = id;

    mandatoryFilters.push(idField);

    if (req.query.trash == true)
    {
        var trashField = {}
        trashField['nd_trash_deleted'] = false;

        mandatoryFilters.push(trashField);
    }

    if (req.query.userid == true)
    {
        var userField = {}
        userField[user_id] = req.user._id;

        mandatoryFilters.push(userField);
    }

    return  {$and: mandatoryFilters};
}