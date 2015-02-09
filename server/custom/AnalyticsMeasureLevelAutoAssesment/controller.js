var AnalyticsMeasureLevelAutoAssesment = connection.model('AnalyticsMeasureLevelAutoAssesment');
require('../../core/controller.js');
function AnalyticsMeasureLevelAutoAssesmentController(model) {  
this.model = model;
this.searchFields = ['measureName', 'refereeName'];
}  
AnalyticsMeasureLevelAutoAssesmentController.inherits(Controller);   
var controller = new AnalyticsMeasureLevelAutoAssesmentController(AnalyticsMeasureLevelAutoAssesment);

exports.AnalyticsMeasureLevelAutoAssesmentFindByEmployee = function(req,res){
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
                    var areas = [], ids = [];

                    for (var i = 0 ; i < position.areas.length ; i++) {
                        if (position.areas[i].status == 1 && position.areas[i].draft == false) {
                            ids.push(position.areas[i]._id);
                            areas.push(position.areas[i]);
                        }
                    }

                    AnalyticsMeasureLevelAutoAssesment.find({level: 'EMPLOYEE', levelID: employee._id, measureID: {$in: ids}},{},function(err, measures){
                        if(err) throw err;

                        var latestMeasures = [];

                        for (var i in areas) {
                            var lastAreaMeasure = null;

                            for (var m in measures) {
                                if (measures[m].measureID == areas[i]._id && (lastAreaMeasure == null || (new Date(measures[m].measureDate).getTime() > new Date(lastAreaMeasure.measureDate).getTime()))) {
                                    lastAreaMeasure = measures[m];
                                }
                            }

                            if (lastAreaMeasure) {
                                lastAreaMeasure = lastAreaMeasure.toObject();

                                lastAreaMeasure['areaColor'] = areas[i].areaColor;

                                latestMeasures.push(lastAreaMeasure);
                            }
                        }

                        res.send(201, {result: 1, items: latestMeasures});
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

exports.AnalyticsMeasureLevelAutoAssesmentGetAreasEvolution = function(req,res){
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
                    var areas = [], ids = [];

                    for (var i = 0 ; i < position.areas.length ; i++) {
                        if (position.areas[i].status == 1 && position.areas[i].draft == false) {
                            ids.push(position.areas[i]._id);
                            areas.push(position.areas[i]);
                        }
                    }

                    var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
                    var dateFrom = new Date(y, m - 1, d);

                    AnalyticsMeasureLevelAutoAssesment.find({level: 'EMPLOYEE', measure: 'AREA', levelID: employee._id, measureID: {$in: ids},  measureDate: {"$gte": dateFrom}},{},
                                                {sort: {measureDate: 1}}, function(err, measures){
                        if(err) throw err;

                        for (var i in areas) {
                            for (var m in measures) {
                                if (measures[m].measureID == areas[i]._id) {
                                    measures[m] = measures[m].toObject();
                                    measures[m]['areaColor'] = areas[i].areaColor;
                                }
                            }
                        }

                        res.send(201, {result: 1, items: measures});
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

exports.AnalyticsMeasureLevelAutoAssesmentGetTPEvolution = function(req,res){
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
                    var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
                    var dateFrom = new Date(y, m - 1, d);

                    AnalyticsMeasureLevelAutoAssesment.find({level: 'EMPLOYEE', measure: 'RANKINGTP', levelID: employee._id,  measureDate: {"$gte": dateFrom}},{},
                                                {sort: {measureDate: 1}}, function(err, measures){
                        if(err) throw err;

                        res.send(201, {result: 1, items: measures});
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

exports.AnalyticsMeasureLevelAutoAssesmentGetAreaEvolution = function(req,res){
    if (!req.query.employee || !req.query.area) {
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
                    var areas = [], ids = [];

                    for (var i = 0 ; i < position.areas.length ; i++) {
                        if (position.areas[i].status == 1 && position.areas[i].draft == false && position.areas[i]._id == req.query.area) {
                            ids.push(position.areas[i]._id);
                            areas.push(position.areas[i]);
                        }
                    }

                    var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
                    var dateFrom = new Date(y, m - 1, d);

                    AnalyticsMeasureLevelAutoAssesment.find({level: 'EMPLOYEE', measure: 'AREA', levelID: employee._id, measureID: {$in: ids},  measureDate: {"$gte": dateFrom}},{},
                        {sort: {measureDate: 1}}, function(err, measures){
                            if(err) throw err;

                            for (var i in areas) {
                                for (var m in measures) {
                                    if (measures[m].measureID == areas[i]._id) {
                                        measures[m] = measures[m].toObject();
                                        measures[m]['areaColor'] = areas[i].areaColor;
                                    }
                                }
                            }

                            res.send(201, {result: 1, items: measures});
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

exports.AnalyticsMeasureLevelAutoAssesmentGetLastTPRating = function(req,res){
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
                    AnalyticsMeasureLevelAutoAssesment.findOne({level: 'EMPLOYEE', measure: 'RANKINGTP', levelID: employee._id},{},
                        {sort: {measureDate: -1}}, function(err, measure){
                            if(err) throw err;

                            res.send(201, {result: 1, item: measure});
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