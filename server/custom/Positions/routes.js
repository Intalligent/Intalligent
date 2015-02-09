module.exports = function (app) {
    var Positions = require('./controller.js');

    /* Positions */
    app.get('/api/custom/Positions/find-all', restrict, Positions.PositionsFindAll);
    app.get('/api/custom/Positions/find-one', restrict, Positions.PositionsFindOne);
    app.get('/api/custom/Positions/find-area', restrict, Positions.PositionsFindArea);
    app.get('/api/custom/Positions/get-evaluable-positions', restrict, Positions.PositionsGetEvaluablePositions);
    app.post('/api/custom/Positions/create', restrict, Positions.PositionsCreate);
    app.post('/api/custom/Positions/update', restrict, Positions.PositionsUpdate);
    app.post('/api/custom/Positions/duplicate', restrict, Positions.PositionsDuplicate);
    app.post('/api/custom/Positions/delete', restrict, Positions.PositionsDelete);
    app.post('/api/custom/Positions/set-status', restrict, Positions.PositionsSetStatus);
}

