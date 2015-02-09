module.exports = function (app) {
    var Units = require('./controller.js');

    app.get('/api/custom/Units/find-all', restrict, Units.UnitsFindAll);
    app.get('/api/custom/Units/find-one', restrict, Units.UnitsFindOne);
    app.post('/api/custom/Units/create', restrict, Units.UnitsCreate);
    app.post('/api/custom/Units/update/:id', restrict, Units.UnitsUpdate);
    app.delete('/api/custom/Units/delete/:id', restrict, Units.UnitsDelete);
} 
