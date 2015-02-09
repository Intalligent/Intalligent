var AnalyticsMeasureLevel = connection.model('AnalyticsMeasureLevel');
require('../../core/controller.js');
function AnalyticsMeasureLevelController(model) {  
this.model = model;  
this.searchFields = ['measureName', 'refereeName'];
}  
AnalyticsMeasureLevelController.inherits(Controller);   
var controller = new AnalyticsMeasureLevelController(AnalyticsMeasureLevel);

exports.AnalyticsMeasureLevelFindByEmployee = function(req,res){
    if (!req.query.employee) {
        res.send(201, {result: 0, msg: "Missing required fields."});
        return;
    }

    var Employees = connection.model('Employees');
    var Positions = connection.model('Positions');

    var measureType = (req.query.type) ? req.query.type : 'areas';

    Employees.findOne({"_id" : req.query.employee},{},function(err, employee){
        if(err) throw err;

        if (employee && employee.actualPosition && employee.actualPosition != '') {
            Positions.findOne({"_id" : employee.actualPosition},{},function(err, position){
                if(err) throw err;

                if (position && position.status == 1 && position.draft == false) {

                    if (measureType == 'areas') {
                        var areas = [], ids = [];

                        for (var i = 0 ; i < position.areas.length ; i++) {
                            if (position.areas[i].status == 1 && position.areas[i].draft == false) {
                                ids.push(position.areas[i]._id);
                                areas.push(position.areas[i]);
                            }
                        }

                        AnalyticsMeasureLevel.find({level: 'EMPLOYEE', levelID: employee._id, measureID: {$in: ids}},{},function(err, measures){
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

exports.AnalyticsMeasureLevelGetAreasEvolution = function(req,res){
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

                    AnalyticsMeasureLevel.find({level: 'EMPLOYEE', measure: 'AREA', levelID: employee._id, measureID: {$in: ids},  measureDate: {"$gte": dateFrom}},{},
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

exports.AnalyticsMeasureLevelGetTPEvolution = function(req,res){
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

                    AnalyticsMeasureLevel.find({level: 'EMPLOYEE', measure: 'RANKINGTP', levelID: employee._id,  measureDate: {"$gte": dateFrom}},{},
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

exports.AnalyticsMeasureLevelGetAreaEvolution = function(req,res){
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

                    AnalyticsMeasureLevel.find({level: 'EMPLOYEE', measure: 'AREA', levelID: employee._id, measureID: {$in: ids},  measureDate: {"$gte": dateFrom}},{},
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

exports.AnalyticsMeasureLevelGetLastEvaluation = function(req,res){
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

                    AnalyticsMeasureLevel.find({level: 'EMPLOYEE', measure: 'AREA', levelID: employee._id, measureID: {$in: ids}},{},
                        {sort: {measureDate: 1}, limit: areas.length}, function(err, measures){
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

exports.AnalyticsMeasureLevelGetLastTPRating = function(req,res){
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
                    AnalyticsMeasureLevel.findOne({level: 'EMPLOYEE', measure: 'RANKINGTP', levelID: employee._id},{},
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

exports.AnalyticsMeasureLevelGetPositionReport = function(req,res){
    if (!req.query.id) {
        res.send(201, {result: 0, msg: "Missing required fields."});
        return;
    }

    var data = req.query, areas = [];
    var Positions = connection.model('Positions');

    Positions.findOne({"_id" : data.id},{},function(err, position){
        if(err) throw err;

        if (position && position.status == 1 && position.draft == false) {
            for (var a in position.areas) {
                var area = position.areas[a], behaviours = [];

                if (area.status == 1 && area.draft == false) {
                    for (var b in area.behaviours) {
                        var behaviour = area.behaviours[b];

                        if (behaviour.status == 1 && behaviour.draft == false) {
                            behaviours.push(behaviour);
                        }
                    }

                    area['behaviours'] = behaviours;

                    areas.push(area);
                }
            }

            //console.log(areas);

            getLastAreasReport(areas, function(areas) {
                console.log(areas);

                res.send(201, {result: 1, item: areas});
            });
        }
        else {
            res.send(201, {result: 0, msg: "Invalid position."});
        }
    });

    /*AnalyticsMeasureLevel.find({level: 'POSITION', positionID: data.id}, {}, {}, function(err, items){
        if(err) throw err;

        res.send(201, {result: 1, items: items});
    });*/
};

exports.AnalyticsMeasureLevelReCalculateRating = function(req,res){
    if (!req.body.ids) {
        console.log("Missing required field 'ids'.");
        res.send(201, {result: 0, msg: "Missing required field 'ids'."});
        return;
    }

    AnalyticsMeasureLevel.reCalculateTPRating(req, req.body.ids, function(result){
        res.send(201, result);
    });
};

function getLastAreasReport(areas, done, index) {
    var index = (index) ? index : 0;
    var area = (areas[index]) ? areas[index] : null;

    if (!area) {
        done(areas);
        return;
    }

    AnalyticsMeasureLevel.find({measure: 'AREA', measureID: area._id, level: 'POSITION'},{},{sort: {measureDate: -1}, limit: 1}, function(err, lastArea){
        if(err) throw err;

        area['value'] = (lastArea.length > 0) ? lastArea[0].value : 0;

        areas[index] = area;

        getLastAreasReport(areas, done, index+1);
    });
}