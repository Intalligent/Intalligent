module.exports = function (app) {
    var AnalyticsMeasureLevel = require('./controller.js');

    app.get('/api/custom/AnalyticsMeasureLevel/find-by-employee', restrict, AnalyticsMeasureLevel.AnalyticsMeasureLevelFindByEmployee);
    app.get('/api/custom/AnalyticsMeasureLevel/get-areas-evolution', restrict, AnalyticsMeasureLevel.AnalyticsMeasureLevelGetAreasEvolution);
    app.get('/api/custom/AnalyticsMeasureLevel/get-tp-evolution', restrict, AnalyticsMeasureLevel.AnalyticsMeasureLevelGetTPEvolution);
    app.get('/api/custom/AnalyticsMeasureLevel/get-area-evolution', restrict, AnalyticsMeasureLevel.AnalyticsMeasureLevelGetAreaEvolution);
    app.get('/api/custom/AnalyticsMeasureLevel/get-last-tprating', restrict, AnalyticsMeasureLevel.AnalyticsMeasureLevelGetLastTPRating);
    app.get('/api/custom/AnalyticsMeasureLevel/get-position-report', restrict, AnalyticsMeasureLevel.AnalyticsMeasureLevelGetPositionReport);

    app.post('/api/custom/AnalyticsMeasureLevel/re-calculate-rating', AnalyticsMeasureLevel.AnalyticsMeasureLevelReCalculateRating);
} 
