var mongoose = require('mongoose');

 var AnalyticsMeasureLevelAutoAssesmentSchema = new mongoose.Schema({
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
 }, { collection: config.app.customCollectionsPrefix+'analyticsMeasureLevelAutoAssesment' });

var AnalyticsMeasureLevelAutoAssesment = connection.model('AnalyticsMeasureLevelAutoAssesment', AnalyticsMeasureLevelAutoAssesmentSchema);
module.exports = AnalyticsMeasureLevelAutoAssesment;