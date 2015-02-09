var Positions = connection.model('Positions');

require('../../core/controller.js');

function PositionsController(model) {
    this.model = model;
    this.searchFields = ['positionName', 'positionDescription'];
}

PositionsController.inherits(Controller);

var controller = new PositionsController(Positions);

exports.PositionsFindAll = function(req,res){
    var getAreas = (req.query.areas) ? ',"areas":1' : '';

    req.query.fields = '{"_id":1,"positionName":1,"positionDescription":1,"status":1,"draft":1'+getAreas+'}';
    req.query.trash = true;

    controller.findAll(req, function(result){
        res.send(201, result);
    });
};

exports.PositionsFindOne = function(req,res){
    req.query.trash = true;

    controller.findOne(req, function(result){
        res.send(201, result);
    });
};

exports.PositionsGetEvaluablePositions = function(req,res){
    var Employees = connection.model('Employees');

    Employees.findOne({"employeeCode": req.user.username},{},{}, function(err, employee){
        if(err) throw err;

        if (employee && employee.actualPosition) {
            Positions.findOne({_id: employee.actualPosition},{"_id":1,"draft":1,"status":1,"positionName":1,"assessmentToEverybody":1,"assessmentTo":1,"assessmentScopeEverybody":1,"assessmentScope":1},{}, function(err, position){
                if(err) throw err;

                if (position) {
                    var find = {draft: false, status: 1};

                    if (!position.assessmentToEverybody)
                        find['_id'] = { "$in": position.assessmentTo};

                    Positions.find(find,{"_id":1,"draft":1,"status":1,"positionName":1},{}, function(err, items){
                        if(err) throw err;

                        res.send(201, {result: 1, items: items});
                    });
                }
                else {
                    res.send(201, {result: 0, msg: "Invalid position"});
                }
            });
        }
        else {
            res.send(201, {result: 0, msg: "Invalid employee"});
        }
    });
};

exports.PositionsFindArea = function(req,res){
    var areaId = req.query.id;

    req.query.id = req.query.position;
    req.query.trash = true;

    controller.findOne(req, function(result){
        var position = result.item, area = null;

        for (var i in position.areas) {
            if (position.areas[i]._id == areaId) {
                area = position.areas[i];
                break;
            }
        }

        if (area) {
            res.send(201, {result: 1, item: area});
        }
        else {
            res.send(201, {result: 0, msg: "Area not found."});
        }
    });
};

exports.PositionsCreate = function(req,res){
    req.query.trash = true;

    if (!Positions.validatePosition(req.body)) {
        res.send(201,{result: 0, msg: "Missing required fields."});

        return;
    }

    controller.create(req, function(result){
        res.send(201, result);
    });
};

exports.PositionsUpdate = function(req,res){
    req.query.trash = true;

    var data = req.body, id = data._id;

    if (!Positions.validatePosition(data)) {
        res.send(201,{result: 0, msg: "Missing required fields."});

        return;
    }

    delete(data.id);
    delete(data._id);

    if (data.areas) {   //actionOrder
        for (var i in data.areas) {
            data.areas[i]['areaOrder'] = i;

            if (data.areas[i].behaviours) {
                for (var j in data.areas[i].behaviours) {
                    data.areas[i].behaviours[j]['itemOrder'] = j;

                    if (data.areas[i].behaviours[j].ratingConfiguration) {
                        for (var r in data.areas[i].behaviours[j].ratingConfiguration) {
                            data.areas[i].behaviours[j].ratingConfiguration[r]['ratingOrder'] = r;

                            if (data.areas[i].behaviours[j].ratingConfiguration[r].actionPlan) {
                                for (var a in data.areas[i].behaviours[j].ratingConfiguration[r].actionPlan) {
                                    data.areas[i].behaviours[j].ratingConfiguration[r].actionPlan[a]['actionOrder'] = a;
                                }
                            }
                        }
                    }
                }
            }
            if (data.areas[i].actionPlan) {
                for (var a in data.areas[i].actionPlan) {
                    data.areas[i].actionPlan[a]['actionOrder'] = a;
                }
            }
        }
    }
    //data._id = mongoose.Types.ObjectId();

    Positions.update({
        "_id" : id
    }, {
        $set: data
    }, function (err, numAffected) {
        if(err) throw err;

        res.send(201,{result: 1, msg: numAffected+" items updated."});
    });
};

exports.PositionsDuplicate = function(req,res){
    req.query.trash = true;

    var data = req.body;

    if (!Positions.validatePosition(data)) {
        res.send(201,{result: 0, msg: "Missing required fields."});

        return;
    }

    delete(data.id);
    delete(data._id);

    if (typeof data.assessmentToEverybody == 'undefined')
        data.assessmentToEverybody = false;
    if (typeof data.assessmentScopeEverybody == 'undefined')
        data.assessmentScopeEverybody = false;
    if (typeof data.canViewEverybody == 'undefined')
        data.canViewEverybody = false;
    if (typeof data.canViewScopeEverybody == 'undefined')
        data.canViewScopeEverybody = false;
    if (typeof data.manageActionPlansToEverybody == 'undefined')
        data.manageActionPlansToEverybody = false;
    if (typeof data.manageActionPlansScopeEverybody == 'undefined')
        data.manageActionPlansScopeEverybody = false;
    if (typeof data.sendEmailAfterEvaluation == 'undefined')
        data.sendEmailAfterEvaluation = false;

    var mongoose = require('mongoose');

    if (data.areas) {
        for (var i in data.areas) {
            data.areas[i]['_id'] = mongoose.Types.ObjectId();

            if (data.areas[i].behaviours) {
                for (var j in data.areas[i].behaviours) {
                    data.areas[i].behaviours[j]['_id'] = mongoose.Types.ObjectId();

                    if (data.areas[i].behaviours[j].ratingConfiguration) {
                        for (var r in data.areas[i].behaviours[j].ratingConfiguration) {
                            data.areas[i].behaviours[j].ratingConfiguration[r]['_id'] = mongoose.Types.ObjectId();

                            if (data.areas[i].behaviours[j].ratingConfiguration[r].actionPlan) {
                                for (var a in data.areas[i].behaviours[j].ratingConfiguration[r].actionPlan) {
                                    data.areas[i].behaviours[j].ratingConfiguration[r].actionPlan[a]['_id'] = mongoose.Types.ObjectId();
                                }
                            }
                        }
                    }
                }
            }
            if (data.areas[i].actionPlan) {
                for (var a in data.areas[i].actionPlan) {
                    data.areas[i].actionPlan[a]['_id'] = mongoose.Types.ObjectId();
                }
            }
        }
    }

    Positions.create(data, function(err, item){
        if(err) throw err;

        res.send(201,{result: 1, msg: "Item created", item: item.toObject()});
    });
};

exports.PositionsDelete = function(req,res){
    var data = req.body;

    var Employees = connection.model('Employees');

    req.query.trash = true;

    data.nd_trash_deleted = true;
    data.nd_trash_deleted_date = new Date();

    console.log(data);

    Employees.update({
        "actualPosition" : data._id
    }, {
        $unset: {
            "actualPosition" : 1,
            "actualPositionName" : 1
        }
    }, {multi: true}, function (err, numAffected) {
        if(err) throw err;

        console.log(numAffected);

        controller.update(req, function(result){
            res.send(201, result);
        });
    });

    /*controller.remove(req, function(result){
        res.send(201, result);
    });*/
};

exports.PositionsSetStatus = function(req,res){
    var data = req.body;
    if (!data.id || typeof data.status == 'undefined') {
        res.send(201,{result: 0, msg: "'id' and 'status' is required."});
        return;
    }

    req.query.trash = true;

    Positions.update({
        "_id" : data.id
    }, {
        $set: {
            "status" : data.status
        }
    }, function (err, numAffected) {
        if(err) throw err;

        res.send(201,{result: 1, msg: "Status updated."});
    });
};