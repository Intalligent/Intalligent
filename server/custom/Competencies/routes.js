module.exports = function (app) {
    var Competencies = require('./controller.js');

    app.get('/api/custom/Competencies/find-all', restrict, Competencies.CompetenciesFindAll);
    app.get('/api/custom/Competencies/find-one', restrict, Competencies.CompetenciesFindOne);
    app.post('/api/custom/Competencies/create', restrict, Competencies.CompetenciesCreate);
    app.post('/api/custom/Competencies/update/:id', restrict, Competencies.CompetenciesUpdate);
    app.delete('/api/custom/Competencies/delete/:id', restrict, Competencies.CompetenciesDelete);
} 
