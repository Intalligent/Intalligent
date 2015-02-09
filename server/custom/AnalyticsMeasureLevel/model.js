var mongoose = require('mongoose');

var AnalyticsMeasureLevelSchema = new mongoose.Schema({
    measureDate: {type: Date},
    measure: {type: String},
    measureID: {type: String},
    measureName: {type: String},
    level: {type: String},
    levelID: {type: String},
    levelName: {type: String},
    refereeID: {type: String},
    refereeName: {type: String},
    employeeID: {type: String},
    employeeName: {type: String},
    positionID: {type: String},
    positionName: {type: String},
    unitID: {type: String},
    unitName: {type: String},
    departmentID: {type: String},
    departmentName: {type: String},
    brandID: {type: String},
    brandName: {type: String},
    value: {type: Number},
    valueEvolution: {type: String},
    valueEvolutionPercentage: {type: Number},
    baseValue: {type: Number},
    accumulatedValue: {type: Number}
}, { collection: config.app.customCollectionsPrefix+'analyticsMeasureLevel' });

var employeeAreaMeasures = [];


AnalyticsMeasureLevelSchema.statics.saveRatings = function(req, appraisalStorage, done){
    var AnalyticsMeasureLevel = this;

    var Employees = connection.model('Employees');
    var Positions = connection.model('Positions');
    var Units = connection.model('Units');
    var Departments = connection.model('Departments');
    var Brands = connection.model('Brands');

    Employees.findOne({"_id" : appraisalStorage.appraisalToEmployee},{},function(err, employee){
        if(err) throw err;

        Positions.findOne({"_id" : employee.actualPosition},{},function(err, position){
            if(err) throw err;

            Units.findOne({"unit" : employee.idunit},{},function(err, unit){
                if(err) throw err;

                Departments.findOne({"_id" : employee.actualDepartment},{},function(err, department){
                    if(err) throw err;

                    Brands.findOne({"_id" : employee.idbrand},{},function(err, brand){
                        if(err) throw err;

                        employee = employee.toObject();

                        employee['positionID'] = employee.actualPosition;
                        employee['positionName'] = position.positionName;
                        employee['unitID'] = employee.idunit;
                        employee['unitName'] = (unit) ? unit.unit : undefined;
                        employee['departmentID'] = employee.actualDepartment;
                        employee['departmentName'] = (department) ? department.department : undefined;
                        employee['brandID'] = employee.idbrand;
                        employee['brandName'] = (brand) ? brand.brand : undefined;

                        AnalyticsMeasureLevel.createRatings(req, appraisalStorage, employee, done);
                    });
                });
            });
        });
    });

}

AnalyticsMeasureLevelSchema.statics.createRatings = function(req, appraisalStorage, employee, done){
    var AnalyticsMeasureLevel = this, ids = [], lastMeasure, testMeasures = [];
    var AnalyticsMeasureLevelAutoAssesment = connection.model('AnalyticsMeasureLevelAutoAssesment');

    var Model = (appraisalStorage.autoAssesment) ? AnalyticsMeasureLevelAutoAssesment : AnalyticsMeasureLevel;

    for (var a in appraisalStorage.areasOverview) {
        if  (appraisalStorage.areasOverview[a].areaID != undefined)
        {
            ids.push(appraisalStorage.areasOverview[a].areaID);
            //console.log('THe area ' +appraisalStorage.areasOverview[a].areaID)

            for (var b in appraisalStorage.areasOverview[a].behaviours) {
                if (appraisalStorage.areasOverview[a].behaviours[b].behaviourID != undefined)
                    ids.push(appraisalStorage.areasOverview[a].behaviours[b].behaviourID);
            }
        }
    }

    //Model.find({refereeID: appraisalStorage.appraisalByEmployee, measureID: {$in: ids}},{},function(err, previousMeasures){
    Model.find({levelID: appraisalStorage.appraisalToEmployee,refereeID: appraisalStorage.appraisalByEmployee, measureID: {$in: ids}, level: 'EMPLOYEE-TEST'},{},function(err, previousMeasures){
        if(err) throw err;

        for (var a in appraisalStorage.areasOverview) {
            var area = appraisalStorage.areasOverview[a], areaValueEvolution = 'SAME', areaValueEvolutionPercentage = null;

            lastMeasure = null;

            for (var m in previousMeasures) {
                if (previousMeasures[m].measureID == area.areaID) {
                    if (lastMeasure == null || (new Date(previousMeasures[m].measureDate).getTime() > new Date(lastMeasure.measureDate).getTime())) {
                        lastMeasure = previousMeasures[m];
                    }
                }
            }

            if (lastMeasure) {
                if (lastMeasure.value > area.areaPercent)
                    areaValueEvolution = 'DOWN';
                if (lastMeasure.value < area.areaPercent)
                    areaValueEvolution = 'UP';
                if (lastMeasure.value != 0)
                    areaValueEvolutionPercentage = (((area.areaPercent-lastMeasure.value)/lastMeasure.value)*100)-100;
            }

            var employeeMeasure = {
                measureDate: new Date(),
                measure: 'AREA',
                measureID: area.areaID,
                measureName: area.areaSubject,
                //level: 'EMPLOYEE',
                level: 'EMPLOYEE-TEST',
                levelID: appraisalStorage.appraisalToEmployee,
                levelName: appraisalStorage.appraisalToEmployeeName,
                employeeID: employee._id,
                employeeName: employee.employeeName,
                positionID: employee.positionID,
                positionName: employee.positionName,
                unitID: employee.unitID,
                unitName: employee.unitName,
                departmentID: employee.departmentID,
                departmentName: employee.departmentName,
                brandID: employee.brandID,
                brandName: employee.brandName,
                refereeID: appraisalStorage.appraisalByEmployee,
                refereeName: appraisalStorage.appraisalByEmployeeName,
                value: area.areaPercent,
                valueEvolution: areaValueEvolution,
                valueEvolutionPercentage: areaValueEvolutionPercentage
            };
            testMeasures.push(employeeMeasure);

            Model.create(employeeMeasure, function(err){
                if(err) throw err;
            });
        }
        AnalyticsMeasureLevel.saveBehaviourRatings(req, appraisalStorage, employee, function() {
            AnalyticsMeasureLevel.saveAreaRatings(req, appraisalStorage, employee, testMeasures, function() {
                AnalyticsMeasureLevel.saveTPRating(req, appraisalStorage, employee, function() {
                    done();
                });
            });
        });
    });
}

AnalyticsMeasureLevelSchema.statics.saveBehaviourRatings = function(req, appraisalStorage, employee, done){
    var AnalyticsMeasureLevel = this, ids = [], lastMeasure;
    var AnalyticsMeasureLevelAutoAssesment = connection.model('AnalyticsMeasureLevelAutoAssesment');

    var Model = (appraisalStorage.autoAssesment) ? AnalyticsMeasureLevelAutoAssesment : AnalyticsMeasureLevel;

    for (var a in appraisalStorage.areasOverview) {
        for (var b in appraisalStorage.areasOverview[a].behaviours) {

            //TODO:  no aplica, nulo
            if (appraisalStorage.areasOverview[a].behaviours[b].behaviourID != undefined)
                ids.push(appraisalStorage.areasOverview[a].behaviours[b].behaviourID);
        }
    }

    Model.find({levelID: appraisalStorage.appraisalToEmployee, measureID: {$in: ids}, level: 'EMPLOYEE', measure: 'BEHAVIOUR'},{},function(err, previousMeasures){
        if(err) throw err;

        for (var a in appraisalStorage.areasOverview) {
            var area = appraisalStorage.areasOverview[a], areaValueEvolution = 'SAME', areaValueEvolutionPercentage = null;

            for (var b in area.behaviours) {
                var behaviour = area.behaviours[b], behaviourValueEvolution = 'SAME', behaviourValueEvolutionPercentage = null;

                lastMeasure = null;

                for (var m in previousMeasures) {
                    if (previousMeasures[m].measureID == behaviour.behaviourID) {
                        if (lastMeasure == null || (new Date(previousMeasures[m].measureDate).getTime() > new Date(lastMeasure.measureDate).getTime())) {
                            lastMeasure = previousMeasures[m];
                        }
                    }
                }

                if (lastMeasure) {
                    if (lastMeasure.value > behaviour.behaviourPercent)
                        behaviourValueEvolution = 'DOWN';
                    if (lastMeasure.value < behaviour.behaviourPercent)
                        behaviourValueEvolution = 'UP';
                    if (lastMeasure.value != 0)
                        behaviourValueEvolutionPercentage = (((behaviour.behaviourPercent-lastMeasure.value)/lastMeasure.value)*100)-100;
                }

                Model.create({
                    measureDate: new Date(),
                    measure: 'BEHAVIOUR',
                    measureID: behaviour.behaviourID,
                    measureName: behaviour.behaviourSubject,
                    level: 'EMPLOYEE',
                    levelID: appraisalStorage.appraisalToEmployee,
                    levelName: appraisalStorage.appraisalToEmployeeName,
                    employeeID: employee._id,
                    employeeName: employee.employeeName,
                    positionID: employee.positionID,
                    positionName: employee.positionName,
                    unitID: employee.unitID,
                    unitName: employee.unitName,
                    departmentID: employee.departmentID,
                    departmentName: employee.departmentName,
                    brandID: employee.brandID,
                    brandName: employee.brandName,
                    value: behaviour.behaviourPercent,
                    valueEvolution: behaviourValueEvolution,
                    valueEvolutionPercentage: behaviourValueEvolutionPercentage
                }, function(err){
                    if(err) throw err;
                });
            }
        }

        done();
    });
}



AnalyticsMeasureLevelSchema.statics.saveAreaRatings = function(req, appraisalStorage, employee, testMeasures, done){
    var AnalyticsMeasureLevel = this, ids = [], lastMeasure;
    var AnalyticsMeasureLevelAutoAssesment = connection.model('AnalyticsMeasureLevelAutoAssesment');

    var Model = (appraisalStorage.autoAssesment) ? AnalyticsMeasureLevelAutoAssesment : AnalyticsMeasureLevel;

    for (var a in appraisalStorage.areasOverview) {
        if (appraisalStorage.areasOverview[a].areaID != undefined)
            ids.push(appraisalStorage.areasOverview[a].areaID);
    }

    var Positions = connection.model('Positions');

    Model.find({levelID: appraisalStorage.appraisalToEmployee, measureID: {$in: ids}, measure: 'AREA', level: 'EMPLOYEE'},{},function(err, previousMeasures){
        if(err) throw err;

        Positions.findOne({_id: employee.actualPosition},{},function(err, position){
            if(err) throw err;

            switch (position.ratingCalculationType) {
                case 1: //Last Evaluation
                    saveArea(req, appraisalStorage, employee, testMeasures, previousMeasures);
                    break;
                case 2: //Average
                    Model.find({refereeID: appraisalStorage.appraisalByEmployee, measureID: {$in: ids}, measure: 'AREA', level: 'EMPLOYEE'},{},function(err, employeeMeasures){
                        if(err) throw err;

                        saveArea(req, appraisalStorage, employee, employeeMeasures, previousMeasures);
                    });
                    break;
                case 3: //Last month average
                    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                    var firstDay = new Date(y, m - 1, 1);
                    var lastDay = new Date(y, m, 0);

                    Model.find({refereeID: appraisalStorage.appraisalByEmployee, measureID: {$in: ids}, measure: 'AREA', level: 'EMPLOYEE',
                        measureDate: {"$gte": firstDay, "$lt": lastDay}},{},function(err, employeeMeasures){
                        if(err) throw err;

                        saveArea(req, appraisalStorage, employee, employeeMeasures, previousMeasures);
                    });
                    break;
                case 4: //Last six month average
                    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                    var firstDay = new Date(y, m - 6, 1);
                    var lastDay = new Date(y, m, 0);

                    Model.find({refereeID: appraisalStorage.appraisalByEmployee, measureID: {$in: ids}, measure: 'AREA', level: 'EMPLOYEE',
                        measureDate: {"$gte": firstDay, "$lt": lastDay}},{},function(err, employeeMeasures){
                        if(err) throw err;

                        saveArea(req, appraisalStorage, employee, employeeMeasures, previousMeasures);
                    });
                    break;
                case 5: //Last year average
                    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                    var firstDay = new Date(y, m - 12, 1);
                    var lastDay = new Date(y, m, 0);

                    Model.find({refereeID: appraisalStorage.appraisalByEmployee, measureID: {$in: ids}, measure: 'AREA', level: 'EMPLOYEE',
                        measureDate: {"$gte": firstDay, "$lt": lastDay}},{},function(err, employeeMeasures){
                        if(err) throw err;

                        saveArea(req, appraisalStorage, employee, employeeMeasures, previousMeasures);
                    });
            }

            done();
        });
    });
}

AnalyticsMeasureLevelSchema.statics.saveTPRating = function(req, appraisalStorage, employee, done){
    var AnalyticsMeasureLevel = this, areasValue = 0;
    var AnalyticsMeasureLevelAutoAssesment = connection.model('AnalyticsMeasureLevelAutoAssesment');

    var Model = (appraisalStorage.autoAssesment) ? AnalyticsMeasureLevelAutoAssesment : AnalyticsMeasureLevel;

    var Employees = connection.model('Employees');
    var Positions = connection.model('Positions');

    Employees.findOne({_id: appraisalStorage.appraisalToEmployee},{},function(err, employee){
        if(err) throw err;

        for (var i in employeeAreaMeasures) {
            areasValue += Number(employeeAreaMeasures[i].value);
        }

        //var topPerformerRating = Math.round((areasValue / employeeAreaMeasures.length) / 10);
        //var topPerformerRating = Math.round((appraisalStorage.appraisalPercent) / 10);
        var topPerformerRating = Number(appraisalStorage.appraisalPercent) / 10;
        var topPerformerRatingEvolution = 'SAME';

        if (employee.topPerformerRating > topPerformerRating)
            topPerformerRatingEvolution = 'DOWN';
        if (employee.topPerformerRating < topPerformerRating)
            topPerformerRatingEvolution = 'UP';

        var topPerformerRatingDate = new Date();
        var numberOfEvaluations = (employee.numberOfEvaluations) ? Number(employee.numberOfEvaluations)+1 : 1;
        var lastEvaluationDate = new Date();

        var employeeUpdate = {"numberOfEvaluations": numberOfEvaluations, "lastEvaluationDate": lastEvaluationDate};

        if (appraisalStorage.autoAssesment) {
            employeeUpdate['topPerformerAutoRating'] = topPerformerRating;
            employeeUpdate['topPerformerAutoRatingEvolution'] = topPerformerRatingEvolution;
            employeeUpdate['topPerformerAutoRatingDate'] = topPerformerRatingDate;
        }
        else {
            employeeUpdate['topPerformerRating'] = topPerformerRating;
            employeeUpdate['topPerformerRatingEvolution'] = topPerformerRatingEvolution;
            employeeUpdate['topPerformerRatingDate'] = topPerformerRatingDate;
        }

        Employees.update({
            "_id" : appraisalStorage.appraisalToEmployee
        }, {
            $set: employeeUpdate
        }, function (err) {
            if(err) throw err;

            if (employee.emailAddress && employee.emailAddress != '' && appraisalStorage.appraisalByEmployeeName) {
                Positions.findOne({_id: employee.actualPosition},{},function(err, position){
                    if(err) throw err;

                    if (position.sendEmailAfterEvaluation && position.sendEmailAfterEvaluation == true) {
                        var postData = {
                            id: "5332c0e30fd012101d00000d",
                            email: employee.emailAddress,
                            tags: '{"FROM_NAME": "'+appraisalStorage.appraisalByEmployeeName+'", "TP_RATING": "'+topPerformerRating+'"}'
                        };
                        sendCommunication(postData);
                    }
                });
            }

            var valueEvolutionPercentage = 0;

            if (employee.topPerformerRating && employee.topPerformerRating != 0) {
                valueEvolutionPercentage = ((topPerformerRating/employee.topPerformerRating)*100)-100;
                valueEvolutionPercentage = (valueEvolutionPercentage && valueEvolutionPercentage >= 0) ? valueEvolutionPercentage : 0;
            }

            Model.create({
                measureDate: new Date(),
                measure: 'RANKINGTP',
                measureID: appraisalStorage._id,
                level: 'EMPLOYEE',
                levelID: appraisalStorage.appraisalToEmployee,
                levelName: appraisalStorage.appraisalToEmployeeName,
                employeeID: employee._id,
                employeeName: employee.employeeName,
                positionID: employee.positionID,
                positionName: employee.positionName,
                unitID: employee.unitID,
                unitName: employee.unitName,
                departmentID: employee.departmentID,
                departmentName: employee.departmentName,
                brandID: employee.brandID,
                brandName: employee.brandName,
                value: topPerformerRating,
                valueEvolution: topPerformerRatingEvolution,
                valueEvolutionPercentage: valueEvolutionPercentage
            }, function(err){
                if(err) throw err;

                done();
            });
        });
    });
}

AnalyticsMeasureLevelSchema.statics.reCalculateTPRating = function(req, employeesIDs, done){
    var Employees = connection.model('Employees');
    var AppraisalStorage = connection.model('AppraisalStorage');

    console.log('ReCalculating Ratings...');

    for (var i in employeesIDs) {
        AppraisalStorage.find({appraisalStatus: 2, appraisalToEmployee: employeesIDs[i]},{},{limit: 1, sort: {appraisalEndDate: -1}}, function(err, items){
            if(err) throw err;

            if (items[0]) {
                var appraisalStorage = items[0].toObject();

                Employees.findOne({_id: appraisalStorage.appraisalToEmployee},{},function(err, employee){
                    if(err) throw err;

                    var topPerformerRating = Number(appraisalStorage.appraisalPercent) / 10;
                    var topPerformerRatingEvolution = 'SAME';

                    if (employee.topPerformerRating > topPerformerRating)
                        topPerformerRatingEvolution = 'DOWN';
                    if (employee.topPerformerRating < topPerformerRating)
                        topPerformerRatingEvolution = 'UP';

                    var topPerformerRatingDate = new Date();

                    var employeeUpdate = {};

                    employeeUpdate['topPerformerRating'] = topPerformerRating;
                    employeeUpdate['topPerformerRatingEvolution'] = topPerformerRatingEvolution;
                    employeeUpdate['topPerformerRatingDate'] = topPerformerRatingDate;

                    Employees.update({
                        "_id" : appraisalStorage.appraisalToEmployee
                    }, {
                        $set: employeeUpdate
                    }, function (err) {
                        if(err) throw err;

                        console.log('TP Rating Generated for '+employee.employeeCode);
                    });
                });
            }
        });

        done({result: 1, msg: 'Ratings Generated'});
    }
}

function saveArea(req, appraisalStorage, employee, employeeMeasures, previousMeasures) {
    var AnalyticsMeasureLevelAutoAssesment = connection.model('AnalyticsMeasureLevelAutoAssesment');

    var Model = (appraisalStorage.autoAssesment) ? AnalyticsMeasureLevelAutoAssesment : AnalyticsMeasureLevel;

    for (var a in appraisalStorage.areasOverview) {
        var area = appraisalStorage.areasOverview[a], totalValue = 0, numAreas = 0, areaValueEvolution = 'SAME', areaValueEvolutionPercentage = null, lastMeasure = null;

        for (var m in previousMeasures) {
            if (previousMeasures[m].measureID == area.areaID) {
                if (lastMeasure == null || (new Date(previousMeasures[m].measureDate).getTime() > new Date(lastMeasure.measureDate).getTime())) {
                    lastMeasure = previousMeasures[m];
                }
            }
        }

        if (lastMeasure) {
            if (lastMeasure.value > area.areaPercent)
                areaValueEvolution = 'DOWN';
            if (lastMeasure.value < area.areaPercent)
                areaValueEvolution = 'UP';
            if (lastMeasure.value != 0)
                areaValueEvolutionPercentage = (((area.areaPercent-lastMeasure.value)/lastMeasure.value)*100)-100;
        }

        for (var m in employeeMeasures) {
            if (employeeMeasures[m].measureID == area.areaID) {
                if (employeeMeasures[m].value != undefined)
                    totalValue += employeeMeasures[m].value;     //Presupone que en el caso de el ultimo test solo viene 1 area por lo que el totalValue = al total del area en cuestion,
                numAreas++;

                //console.log('Total value:' + totalValue);
                //console.log(JSON.stringify(employeeMeasures[m]));
            }
        }

        var theValue =  Math.round(totalValue/numAreas);
        if (totalValue == 0)
            theValue = 0;

        if (theValue != undefined)
        {
            var theAreaMeasure = {
                measureDate: new Date(),
                measure: 'AREA',
                measureID: area.areaID,
                measureName: area.areaSubject,
                level: 'EMPLOYEE',
                levelID: appraisalStorage.appraisalToEmployee,
                levelName: appraisalStorage.appraisalToEmployeeName,
                employeeID: employee._id,
                employeeName: employee.employeeName,
                positionID: employee.positionID,
                positionName: employee.positionName,
                unitID: employee.unitID,
                unitName: employee.unitName,
                departmentID: employee.departmentID,
                departmentName: employee.departmentName,
                brandID: employee.brandID,
                brandName: employee.brandName,
                refereeID: appraisalStorage.appraisalByEmployee,
                refereeName: appraisalStorage.appraisalByEmployeeName,
                value: theValue,
                valueEvolution: areaValueEvolution,
                valueEvolutionPercentage: areaValueEvolutionPercentage
            };

            employeeAreaMeasures.push(theAreaMeasure);

            Model.create(theAreaMeasure, function(err){
                if(err) throw err;
            });
        }
    }
}



function saveRating(req, appraisalStorage, employeeMeasures, previousMeasures) {
    //DEPRECATED
    for (var a in appraisalStorage.areasOverview) {
        var area = appraisalStorage.areasOverview[a], totalValue = 0, numAreas = 0, areaValueEvolution = 'SAME', areaValueEvolutionPercentage = null, lastMeasure = null;

        for (var m in previousMeasures) {
            if (previousMeasures[m].measureID == area.areaID) {
                if (lastMeasure == null || (new Date(previousMeasures[m].measureDate).getTime() > new Date(lastMeasure.measureDate).getTime())) {
                    lastMeasure = previousMeasures[m];
                }
            }
        }

        if (lastMeasure) {
            if (lastMeasure.value > area.areaPercent)
                areaValueEvolution = 'DOWN';
            if (lastMeasure.value < area.areaPercent)
                areaValueEvolution = 'UP';
            if (lastMeasure.value != 0)
                areaValueEvolutionPercentage = (((area.areaPercent-lastMeasure.value)/lastMeasure.value)*100)-100;
        }

        for (var m in employeeMeasures) {
            if (employeeMeasures[m].measureID == area.areaID) {
                totalValue += employeeMeasures[m].value;
                numAreas++;
            }
        }

        AnalyticsMeasureLevel.create({
            measureDate: new Date(),
            measure: 'AREA',
            measureID: area.areaID,
            measureName: area.areaSubject,
            level: 'EMPLOYEE-TEST',
            levelID: appraisalStorage.appraisalToEmployee,
            levelName: appraisalStorage.appraisalToEmployeeName,
            refereeID: appraisalStorage.appraisalByEmployee,
            refereeName: appraisalStorage.appraisalByEmployeeName,
            value: Math.round(totalValue/numAreas),
            valueEvolution: areaValueEvolution,
            valueEvolutionPercentage: areaValueEvolutionPercentage
        }, function(err){
            if(err) throw err;
        });
    }
}


var AnalyticsMeasureLevel = connection.model('AnalyticsMeasureLevel', AnalyticsMeasureLevelSchema);
module.exports = AnalyticsMeasureLevel;