module.exports = function (app) {
    var AnalyticsMeasureLevelAutoAssesment = require('./controller.js');

    app.get('/api/custom/AnalyticsMeasureLevelAutoAssesment/find-by-employee', restrict, AnalyticsMeasureLevelAutoAssesment.AnalyticsMeasureLevelAutoAssesmentFindByEmployee);
    //app.get('/api/custom/AnalyticsMeasureLevelAutoAssesment/get-areas-evolution', restrict, AnalyticsMeasureLevelAutoAssesment.AnalyticsMeasureLevelAutoAssesmentGetAreasEvolution);
    //app.get('/api/custom/AnalyticsMeasureLevelAutoAssesment/get-tp-evolution', restrict, AnalyticsMeasureLevelAutoAssesment.AnalyticsMeasureLevelAutoAssesmentGetTPEvolution);
    app.get('/api/custom/AnalyticsMeasureLevelAutoAssesment/get-area-evolution', restrict, AnalyticsMeasureLevelAutoAssesment.AnalyticsMeasureLevelAutoAssesmentGetAreaEvolution);
    app.get('/api/custom/AnalyticsMeasureLevelAutoAssesment/get-last-tprating', restrict, AnalyticsMeasureLevelAutoAssesment.AnalyticsMeasureLevelAutoAssesmentGetLastTPRating);
} 
