module.exports = function (app) {
    var PositionAreas = require('./controller.js');

    app.get('/api/custom/PositionAreas/find-all', restrict, PositionAreas.PositionAreasFindAll);
    app.get('/api/custom/PositionAreas/find-one', restrict, PositionAreas.PositionAreasFindOne);
    app.post('/api/custom/PositionAreas/create', restrict, PositionAreas.PositionAreasCreate);
    app.post('/api/custom/PositionAreas/update/:id', restrict, PositionAreas.PositionAreasUpdate);
    app.delete('/api/custom/PositionAreas/delete/:id', restrict, PositionAreas.PositionAreasDelete);
} 
